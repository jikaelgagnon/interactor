import { db } from "./background/database/firebase";
import { collection, query, where, getDocs, doc, writeBatch} from "firebase/firestore";
import { utils, writeFile } from "xlsx";
import { ActivityDocument } from "./common/dbdocument";


interface SessionData {
    id: string;
    sessionInfo: {
        email: string;
        startTime: string;
        endTime?: string;
        sourceURL: string;
        sourceDocumentTitle: string;
    };
    activities: ActivityDocument[];
}

interface FirebaseSessionData {
    id: string;
    sessionInfo?: {
        email: string;
        startTime: string;
        endTime?: string;
        sourceURL: string;
        sourceDocumentTitle: string;
    };
    documents?: ActivityDocument[];
}

/**
 * Manages user data retrieval, display, and deletion operations for browser extension sessions.
 * Handles Firebase Firestore operations and provides a user interface for data management.
 */
class DataManager {
    // A list of all sessions obtained when querying the database for the user's data
    private sessions: SessionData[] = [];
    // A list of strings identifying all sessions that are selected to be deleted
    private selectedItems = new Set<string>();
    // The user's email address. If not found it's set to an empty string.
    private userEmail = '';
    // A set of session IDs that are currently expanded in the UI
    private expandedSessions = new Set<string>();

    /**
     * Initializes the DataManager by loading user data and setting up the UI.
     * This method coordinates the startup sequence of the application.
     * @returns A Promise that resolves when initialization is complete
     */
    public static async init(): Promise<void> {
        const manager = new DataManager();
        await manager.getUserEmail();
        await manager.loadData();
        manager.setupEventListeners();
        manager.render();
    }

    /**
     * An async function that gets the user's email from their Chrome login
     * @returns Promise containing the user's email
     */

    async getUserEmail(): Promise<string> {
        return new Promise((resolve) => {
            chrome.identity.getProfileUserInfo((userInfo) => {
                if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError.message);
                    this.userEmail = '';
                } else {
                    this.userEmail = userInfo.email || '';
                }
                resolve(this.userEmail);
            });
        });
    }

    /**
     * Fetches data from the database and transforms each document into
     * a JS object, then saves the result in `this.session`
     */

    async loadData(): Promise<void> {
        if (!this.userEmail) {
            console.log("email:", this.userEmail);
            this.sessions = [];
            return;
        }

        try {
            const userData = await this.getUserDataFromFirebase();
            this.sessions = this.transformFirebaseData(userData);
        } catch (error) {
            console.error('Error loading data:', error);
            this.showStatus('Error loading data', 'error');
            this.sessions = [];
        }
    }

    /**
     * Gets all documents in the database assosciated with the current user
     * @returns A Promise containg an array of each session in the user's data
     */

    async getUserDataFromFirebase(): Promise<FirebaseSessionData[]> {
        if (!this.userEmail) {
            console.log("Skipping Firebase read");
            return [];
        }

        try {
            const q = query(
                collection(db, "userData"),
                where("sessionInfo.email", "==", this.userEmail)
            );
            
            const querySnapshot = await getDocs(q);
            const userData: FirebaseSessionData[] = [];
            
            querySnapshot.forEach((docSnapshot) => {
                userData.push({
                    id: docSnapshot.id,
                    ...docSnapshot.data()
                } as FirebaseSessionData);
            });
            
            console.log(`Retrieved ${userData.length} sessions for user:`, this.userEmail);
            return userData;
        } catch (error) {
            console.error("Error getting user data from Firebase:", error);
            throw error;
        }
    }

    /**
     * Converts database documents to JS objects and sorts them by `startTime`
     * @param firebaseData - An array of session objects
     * @returns - An array of session objects sorted by `startTime`
     */

    transformFirebaseData(firebaseData: FirebaseSessionData[]): SessionData[] {
        const sessions: SessionData[] = firebaseData.map(session => ({
            id: session.id,
            sessionInfo: session.sessionInfo ?? {
                email: '',
                startTime: '',
                sourceURL: '',
                sourceDocumentTitle: ''
            },
            activities: session.documents ?? []
        }));

        // Sort sessions by start time (newest first)
        return sessions.sort((a, b) => {
            const timeA = new Date(a.sessionInfo.startTime ?? 0).getTime();
            const timeB = new Date(b.sessionInfo.startTime ?? 0).getTime();
            return timeB - timeA;
        });
    }

    /**
     * Sets up event listeners for the select all checkbox (which selects all items in the list when
     * toggled), and the delete button, which prompts the user to confirm before deleting a session.
     */
    setupEventListeners(): void {
        const selectAllCheckbox = document.getElementById('selectAll') as HTMLInputElement;
        const deleteButton = document.getElementById('deleteSelected') as HTMLButtonElement;

        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                const isChecked = (e.target as HTMLInputElement).checked
                this.toggleSelectAll(isChecked);
            });
        }

        if (deleteButton) {
            deleteButton.addEventListener('click', () => {
                void this.deleteSelected();
            });
        }

        const exportToJSONButton = document.getElementById('exportToJson') as HTMLButtonElement;
        if (exportToJSONButton) {
            const hasSessionsSelected = Array.from(this.selectedItems).some(id => id.startsWith('session_'));
            exportToJSONButton.disabled = !hasSessionsSelected;
            exportToJSONButton.addEventListener('click', () => {
                this.exportSessionsToJson();
            });
        }

        const exportToXLSXButton = document.getElementById('exportToXLSX') as HTMLButtonElement;
        if (exportToXLSXButton) {
            const hasSessionsSelected = Array.from(this.selectedItems).some(id => id.startsWith('session_'));
            exportToXLSXButton.disabled = !hasSessionsSelected;
            exportToXLSXButton.addEventListener('click', () => {
                this.exportSessionsToXlsx();
            });
        }

    }

    exportSessionsToXlsx(): void {
        const selectedSessionIds = Array.from(this.selectedItems)
            .filter(id => id.startsWith('session_'))
            .map(id => id.split('_')[1]);

        const sessionsToExport = this.sessions.filter(session => selectedSessionIds.includes(session.id));

        if (sessionsToExport.length === 0) {
            this.showStatus('No sessions selected for export', 'error');
            return;
        }

        const workbook = utils.book_new();

        sessionsToExport.forEach((session) => {
            const activities = session.activities || [];

            // Flatten metadata into a string
            const flattenedActivities = activities.map(activity => {
                const metadata = activity.metadata ?? {};
                const metadataSummary = Object.entries(metadata)
                    .map(([key, value]) => `${key}=${String(value)}`)
                    .join(', ');

                return {
                    ...activity,
                    metadataSummary
                };
            });

            // Optionally remove the raw metadata field to avoid [object Object]
            flattenedActivities.forEach(a => delete a.metadata);

            const worksheet = utils.json_to_sheet(flattenedActivities);

            // Ensure sheet name is valid (max 31 chars, no special chars)
            // const safeSheetName = session.id.replace(/[:\/\\?\[\]\*]/g, "").slice(0, 31);

            // Characters not allowed in sheet names: : / \ ? [ ] *
            // Using a regex literal
            const invalidChars = /[:/\\?[\]*]/g;
            const safeSheetName = session.id.replace(invalidChars, "").slice(0, 31);

            utils.book_append_sheet(workbook, worksheet, safeSheetName);
        });

        const filename = `sessions_export_${new Date().toISOString()}.xlsx`;
        writeFile(workbook, filename);

        this.showStatus(`Exported ${sessionsToExport.length} session(s) to XLSX`);
    }


    exportSessionsToJson(): void {
        const selectedSessionIds = Array.from(this.selectedItems)
            .filter(id => id.startsWith('session_'))
            .map(id => id.split('_')[1]);

        const sessionsToExport = this.sessions.filter(session => selectedSessionIds.includes(session.id));

        if (sessionsToExport.length === 0) {
            this.showStatus('No sessions selected for export', 'error');
            return;
        }

        const filename = `sessions_export_${new Date().toISOString()}.json`;
        const jsonStr = JSON.stringify(sessionsToExport, null, 2);

        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showStatus(`Exported ${sessionsToExport.length} session(s) to JSON`);
    }



    /**
     * Renders the complete user interface by generating HTML elements for all sessions and activities.
     * Clears the existing container and rebuilds the entire UI from the current session data.
     */
    render(): void {
        // container will contain all the rendered data from the database
        const container = document.getElementById('dataContainer');
        if (!container) return;

        if (this.sessions.length === 0) {
            container.innerHTML = '<div class="no-data">No data found</div>';
            return;
        }

        // Clear container
        container.innerHTML = '';
        
        // Create session elements and add them to the container
        this.sessions.forEach(session => {
            const sessionElement = this.createSessionElement(session);
            container.appendChild(sessionElement);
        });

        this.updateUI();
    }

    /**
     * Extracts the base domain name from a URL by splitting on dots and returning the second part.
     * @param url - The URL string to extract the base name from
     * @returns The base domain name (e.g., "google" from "www.google.com")
     */
    baseName(url: string): string {
        const base = url.split(".")[1]
        return base;
    }

    /**
     * Converts a session data object into an HTML element
     * @param session - An object representing the data from a session
     * @returns The session object as an HTML element
     */
    createSessionElement(session: SessionData): HTMLElement {
        const sessionDiv = document.createElement('div');
        sessionDiv.className = 'session-group';
        
        const startTime = new Date(session.sessionInfo.startTime ?? '').toLocaleString();
        const endTime = session.sessionInfo.endTime ? 
            new Date(session.sessionInfo.endTime).toLocaleString() : 'Ongoing';
        
        // Create session header
        const sessionHeader = document.createElement('div');
        sessionHeader.className = 'session-header';
        
        const isSessionSelected = this.selectedItems.has(`session_${session.id}`);
        
        sessionHeader.innerHTML = `
            <div class="session-info">
                <div class="session-checkbox">
                    <input type="checkbox" id="session_${session.id}" ${isSessionSelected ? 'checked' : ''}>
                    <span class="session-title">${session.id} - ${session.sessionInfo.sourceDocumentTitle}</span>
                </div>
                <div class="session-meta">
                    <span class="session-time">${startTime} - ${endTime}</span>
                    <span class="activity-count">${session.activities.length} activities</span>
                </div>
            </div>
            <button class="toggle-activities" data-session-id="${session.id}">
                ${this.isSessionExpanded(session.id) ? '▼' : '▶'}
            </button>
        `;
        
        // Create activities container
        const activitiesContainer = document.createElement('div');
        activitiesContainer.className = `activities-container ${this.isSessionExpanded(session.id) ? 'expanded' : 'collapsed'}`;
        
        if (session.activities.length > 0) {
            session.activities.forEach((activity, index) => {
                const activityElement = this.createActivityElement(activity, session.id, index);
                activitiesContainer.appendChild(activityElement);
            });
        } else {
            activitiesContainer.innerHTML = '<div class="no-activities">No activities in this session</div>';
        }
        
        sessionDiv.appendChild(sessionHeader);
        sessionDiv.appendChild(activitiesContainer);
        
        // Add event listeners
        this.addSessionEventListeners(sessionDiv, session);
        
        return sessionDiv;
    }

    /**
     * Creates an HTML element representing a single activity within a session.
     * @param activity - The activity data object containing metadata and content
     * @param sessionId - The ID of the parent session
     * @param index - The index of this activity within the session
     * @returns An HTML element representing the activity
     */
    createActivityElement(activity: ActivityDocument, sessionId: string, index: number): HTMLElement {
        const activityId = `activity_${sessionId}_${index}`;
        const isSelected = this.selectedItems.has(activityId);
        
        const activityDiv = document.createElement('div');
        activityDiv.className = `activity-item ${isSelected ? 'selected' : ''}`;
        
        const timestamp = activity.createdAt ? 
            new Date(activity.createdAt).toLocaleString() : 'No timestamp';
        
        activityDiv.innerHTML = `
            <div class="activity-header">
                <div class="activity-checkbox">
                    <span class="activity-label">Activity ${index + 1}</span>
                </div>
                <span class="activity-timestamp">${timestamp}</span>
            </div>
            <div class="activity-content">
                <pre></pre>
            </div>
        `;

        if (activity.metadata && 'html' in activity.metadata) {
            delete (activity.metadata as Record<string, unknown>).html;
        }
        
        
        // Set JSON content as text
        const preElement = activityDiv.querySelector('pre');
        if (preElement) {
            preElement.textContent = JSON.stringify(activity, null, 2);
        }
        
        // Add event listener for activity checkbox
        const checkbox = activityDiv.querySelector(`#${activityId}`);
        if (checkbox) {
            checkbox.addEventListener('change', (e) => {
                this.toggleItemSelection(activityId, (e.target as HTMLInputElement).checked);
            });
        }
        
        return activityDiv;
    }

    /**
     * Adds event listeners to a session element for checkbox selection and expansion toggle.
     * @param sessionDiv - The HTML element representing the session
     * @param session - The session data object
     */
    addSessionEventListeners(sessionDiv: HTMLElement, session: SessionData): void {
        // Session checkbox
        const sessionCheckbox = sessionDiv.querySelector(`#session_${session.id}`);
        if (sessionCheckbox) {
            sessionCheckbox.addEventListener('change', (e) => {
                this.toggleSessionSelection(session.id, (e.target as HTMLInputElement).checked);
            });
        }
        
        // Toggle button
        const toggleButton = sessionDiv.querySelector('.toggle-activities');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => {
                this.toggleSessionExpansion(session.id);
            });
        }
    }

    /**
     * Toggles the selection state of a session and all its activities.
     * When a session is selected, all its activities are automatically selected.
     * When deselected, all activities are also deselected.
     * @param sessionId - The unique identifier of the session
     * @param isSelected - Whether the session should be selected (true) or deselected (false)
     */
    toggleSessionSelection(sessionId: string, isSelected: boolean): void {
        const sessionKey = `session_${sessionId}`;
        
        if (isSelected) {
            this.selectedItems.add(sessionKey);
            // Also select all activities in this session
            const session = this.sessions.find(s => s.id === sessionId);
            if (session) {
                session.activities.forEach((_, index) => {
                    this.selectedItems.add(`activity_${sessionId}_${index}`);
                });
            }
        } else {
            this.selectedItems.delete(sessionKey);
            // Also deselect all activities in this session
            const session = this.sessions.find(s => s.id === sessionId);
            if (session) {
                session.activities.forEach((_, index) => {
                    this.selectedItems.delete(`activity_${sessionId}_${index}`);
                });
            }
        }
        
        this.render();
    }

    /**
     * Toggles the selection state of an individual item (session or activity).
     * If deselecting an activity, also deselects the parent session if it was selected.
     * @param itemId - The unique identifier of the item (format: "session_ID" or "activity_SESSION_INDEX")
     * @param isSelected - Whether the item should be selected (true) or deselected (false)
     */
    toggleItemSelection(itemId: string, isSelected: boolean): void {
        if (isSelected) {
            this.selectedItems.add(itemId);
        } else {
            this.selectedItems.delete(itemId);
            
            // If it's an activity, also uncheck the session if it was selected
            if (itemId.startsWith('activity_')) {
                const sessionId = itemId.split('_')[1];
                this.selectedItems.delete(`session_${sessionId}`);
            }
        }
        this.updateUI();
    }

    /**
     * Selects / deselects all items in the sessions user's data list. If a session with ID `x` is selected
     * then the string `"session_x"` is added to `this.selectedItems`.
     * @param selectAll  - A boolean indicating whether selectAll (true) or deselectAll (false)
     */

    toggleSelectAll(selectAll: boolean): void {
        if (selectAll) {
            this.sessions.forEach(session => {
                this.selectedItems.add(`session_${session.id}`);
                session.activities.forEach((_, index) => {
                    this.selectedItems.add(`activity_${session.id}_${index}`);
                });
            });
        } else {
            this.selectedItems.clear();
        }

        this.render();  // Ensure the UI updates
    }

    /**
     * Toggles the expanded/collapsed state of a session's activities list.
     * @param sessionId - The unique identifier of the session to toggle
     */
    toggleSessionExpansion(sessionId: string): void {
        if (this.expandedSessions.has(sessionId)) {
            this.expandedSessions.delete(sessionId);
        } else {
            this.expandedSessions.add(sessionId);
        }
        this.render();
    }

    /**
     * Checks whether a session is currently in an expanded state.
     * @param sessionId - The unique identifier of the session to check
     * @returns True if the session is expanded, false if collapsed
     */
    isSessionExpanded(sessionId: string): boolean {
        return this.expandedSessions.has(sessionId);
    }

    /**
     * Updates the user interface elements to reflect the current selection state.
     * Manages the select-all checkbox state, delete button state, and visual styling of selected items.
     */
    updateUI(): void {
        const selectAllCheckbox = document.getElementById('selectAll') as HTMLInputElement;
        const deleteButton = document.getElementById('deleteSelected') as HTMLButtonElement;
        const exportToJsonButton = document.getElementById('exportToJson') as HTMLButtonElement;
        const exportToXLSXButton = document.getElementById('exportToXLSX') as HTMLButtonElement;


        if (!selectAllCheckbox || !deleteButton) return;

        // Calculate total selectable items
        const totalItems = this.sessions.length + this.sessions.reduce((sum, session) => sum + session.activities.length, 0);
        
        // Update select all checkbox state
        const allSelected = totalItems > 0 && this.selectedItems.size === totalItems;
        const someSelected = this.selectedItems.size > 0;
        
        selectAllCheckbox.checked = allSelected;
        selectAllCheckbox.indeterminate = someSelected && !allSelected;

        // Update delete button state
        deleteButton.disabled = this.selectedItems.size === 0;
        exportToJsonButton.disabled = deleteButton.disabled;
        exportToXLSXButton.disabled = deleteButton.disabled;
    
        const sessionsToDelete = Array.from(this.selectedItems).filter((name) => name.startsWith("session_"));
        deleteButton.textContent = `Delete Selected (${sessionsToDelete.length})`;

        // Update item styling
        this.sessions.forEach(session => {
            // Update session styling
            const sessionElement = document.getElementById(`session_${session.id}`)?.closest('.session-group');
            if (sessionElement) {
                sessionElement.classList.toggle('selected', this.selectedItems.has(`session_${session.id}`));
            }
            
            // Update activity styling
            session.activities.forEach((_, index) => {
                const activityId = `activity_${session.id}_${index}`;
                const activityElement = document.getElementById(activityId)?.closest('.activity-item');
                if (activityElement) {
                    activityElement.classList.toggle('selected', this.selectedItems.has(activityId));
                }
            });
        });
    }

    /**
     * Deletes each selected item then reloads data before re-rendering the page.
     */
    async deleteSelected(): Promise<void> {
        if (this.selectedItems.size === 0) return;

        const itemsToDelete = Array.from(this.selectedItems);
        const sessionsToDelete = itemsToDelete.filter((name) => name.startsWith("session_"));

        const confirmMessage = `Are you sure you want to delete ${sessionsToDelete.length} item(s)? This action cannot be undone.`;
        
        if (!confirm(confirmMessage)) return;

        try {
            // Show loading state
            const deleteButton = document.getElementById('deleteSelected') as HTMLButtonElement;
            if (deleteButton) {
                deleteButton.textContent = 'Deleting...';
                deleteButton.disabled = true;
            }

            const deleteResult = await this.deleteUserDataFromFirebase(itemsToDelete);
            
            if (deleteResult.success) {
                // Reload data from Firebase to ensure consistency
                await this.loadData();
                this.selectedItems.clear();
                this.render();
                this.showStatus(`Successfully deleted ${sessionsToDelete.length} item(s)`);
            } else {
                throw new Error(deleteResult.error ?? 'Failed to delete items');
            }

        } catch (error) {
            console.error('Error deleting items:', error);
            this.showStatus('Error deleting items', 'error');
        } finally {
            // Reset button state
            const deleteButton = document.getElementById('deleteSelected') as HTMLButtonElement;
            if (deleteButton) {
                deleteButton.textContent = 'Delete Selected';
                deleteButton.disabled = true;
            }
        }
    }

    /**
     * Deletes all selected items when delete button is pressed.
     * @param itemIds - A list of IDs of the form `"session_<session_id>"` to be deleted
     */
    async deleteUserDataFromFirebase(itemIds: string[]): Promise<{success: boolean, error?: string}> {
        if (!this.userEmail || !itemIds.length) {
            return { success: false, error: "Invalid parameters" };
        }

        try {
            const sessionIds = itemIds.filter((name) => name.startsWith("session_")).map((session_name) => session_name.split("_")[1]);

            // Process deletions

            const batch = writeBatch(db);

            for (const sessionId of sessionIds) {
                const sessionDocRef = doc(db, "userData", sessionId);
                batch.delete(sessionDocRef);
            }

            await batch.commit();
            
            console.log(`Successfully processed deletion of ${sessionIds.length} items`);
            return { success: true };
            
        } catch (error) {
            console.error("Error deleting user data:", error);
            return { 
                success: false, 
                error: error instanceof Error ? error.message : "Unknown error occurred"
            };
        }
    }

    /**
     * Displays a status message to the user with automatic dismissal after 3 seconds.
     * @param message - The message text to display
     * @param type - The type of message ('success' or 'error'), defaults to 'success'
     */
    showStatus(message: string, type = 'success'): void {
        const statusElement = document.getElementById('statusMessage');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `status-message ${type}`;
            statusElement.style.display = 'block';

            setTimeout(() => {
                statusElement.style.display = 'none';
            }, 3000);
        }
    }
}

/**
 * Initializes the DataManager when the DOM content is fully loaded.
 * This ensures all HTML elements are available before the application starts.
 */
document.addEventListener('DOMContentLoaded', () => {
    void DataManager.init();
});