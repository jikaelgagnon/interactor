// import { db } from "./database/firebase";
// import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

// class DataManager {
//     private data: any[] = [];
//     private selectedItems: Set<string> = new Set();
//     private userEmail: string = '';

//     constructor() {
//         this.init();
//     }

//     async init(): Promise<void> {
//         await this.getUserEmail();
//         await this.loadData();
//         this.setupEventListeners();
//         this.render();
//     }

//     async getUserEmail(): Promise<string> {
//         return new Promise((resolve) => {
//             chrome.identity.getProfileUserInfo((userInfo) => {
//                 if (chrome.runtime.lastError) {
//                     console.log(chrome.runtime.lastError.message);
//                     this.userEmail = '';
//                 } else {
//                     this.userEmail = userInfo.email || '';
//                 }
//                 resolve(this.userEmail);
//             });
//         });
//     }

//     async loadData(): Promise<void> {
//         if (!this.userEmail) {
//             console.log("email:", this.userEmail);
//             this.data = [];
//             return;
//         }

//         try {
//             const userData = await this.getUserDataFromFirebase();
//             this.data = this.transformFirebaseData(userData);
//         } catch (error) {
//             console.error('Error loading data:', error);
//             this.showStatus('Error loading data', 'error');
//             this.data = [];
//         }
//     }

//     async getUserDataFromFirebase(): Promise<any[]> {
//         if (!this.userEmail) {
//             console.log("Skipping Firebase read");
//             return [];
//         }

//         try {
//             const q = query(
//                 collection(db, "userData"),
//                 where("sessionInfo.email", "==", this.userEmail)
//             );
            
//             const querySnapshot = await getDocs(q);
//             const userData: any[] = [];
            
//             querySnapshot.forEach((docSnapshot) => {
//                 userData.push({
//                     id: docSnapshot.id,
//                     ...docSnapshot.data()
//                 });
//             });
            
//             console.log(`Retrieved ${userData.length} sessions for user:`, this.userEmail);
//             return userData;
//         } catch (error) {
//             console.error("Error getting user data from Firebase:", error);
//             throw error;
//         }
//     }

//     transformFirebaseData(firebaseData: any[]): any[] {
//         const transformedData: any[] = [];
        
//         firebaseData.forEach(session => {
//             // Add session info as a data item
//             transformedData.push({
//                 id: `session_${session.id}`,
//                 type: 'session',
//                 timestamp: session.sessionInfo?.startTime || new Date().toISOString(),
//                 data: {
//                     type: 'session_info',
//                     email: session.sessionInfo?.email,
//                     startTime: session.sessionInfo?.startTime,
//                     endTime: session.sessionInfo?.endTime,
//                     url: session.sessionInfo?.url,
//                     title: session.sessionInfo?.title,
//                     sessionId: session.id
//                 }
//             });

//             // Add each activity document as a separate item
//             if (session.documents && Array.isArray(session.documents)) {
//                 session.documents.forEach((doc: any, index: number) => {
//                     transformedData.push({
//                         id: `activity_${session.id}_${index}`,
//                         type: 'activity',
//                         timestamp: doc.timestamp || new Date().toISOString(),
//                         sessionId: session.id,
//                         data: doc
//                     });
//                 });
//             }
//         });

//         // Sort by timestamp (newest first)
//         return transformedData.sort((a, b) => 
//             new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
//         );
//     }

//     setupEventListeners(): void {
//         const selectAllCheckbox = document.getElementById('selectAll') as HTMLInputElement;
//         const deleteButton = document.getElementById('deleteSelected') as HTMLButtonElement;

//         if (selectAllCheckbox) {
//             selectAllCheckbox.addEventListener('change', (e) => {
//                 this.toggleSelectAll((e.target as HTMLInputElement).checked);
//             });
//         }

//         if (deleteButton) {
//             deleteButton.addEventListener('click', () => {
//                 this.deleteSelected();
//             });
//         }
//     }

//     render(): void {
//         const container = document.getElementById('dataContainer');
//         if (!container) return;
        
//         if (this.data.length === 0) {
//             container.innerHTML = '<div class="no-data">No data found</div>';
//             return;
//         }

//         const itemsHtml = this.data.map(item => this.renderDataItem(item)).join('');
//         container.innerHTML = itemsHtml;

//         // Add event listeners to checkboxes
//         this.data.forEach(item => {
//             const checkbox = document.getElementById(`item_${item.id}`) as HTMLInputElement;
//             if (checkbox) {
//                 checkbox.addEventListener('change', (e) => {
//                     this.toggleItemSelection(item.id, (e.target as HTMLInputElement).checked);
//                 });
//             }
//         });

//         this.updateUI();
//     }

//     renderDataItem(item: any): string {
//         const isSelected = this.selectedItems.has(item.id);
//         const timestamp = new Date(item.timestamp).toLocaleString();
        
//         const typeLabel = item.type === 'session' ? '📋 Session' : '🔄 Activity';
//         const typeClass = item.type === 'session' ? 'session-item' : 'activity-item';

//         const itemDiv = document.createElement('div');
//         itemDiv.className = `data-item ${isSelected ? 'selected' : ''} ${typeClass}`;
        
//         itemDiv.innerHTML = `
//             <div class="item-header">
//                 <div class="item-checkbox">
//                     <input type="checkbox" id="item_${item.id}" ${isSelected ? 'checked' : ''}>
//                     <span class="item-id">${typeLabel} - ${item.id}</span>
//                 </div>
//                 <span class="item-timestamp">${timestamp}</span>
//             </div>
//             <div class="item-content">
//                 <pre></pre>
//             </div>
//         `;
        
//         // Set JSON content as text, not HTML
//         const preElement = itemDiv.querySelector('pre');
//         if (preElement) {
//             preElement.textContent = JSON.stringify(item.data, null, 2);
//         }
        
//         return itemDiv.outerHTML;
//     }

//     toggleItemSelection(itemId: string, isSelected: boolean): void {
//         if (isSelected) {
//             this.selectedItems.add(itemId);
//         } else {
//             this.selectedItems.delete(itemId);
//         }
//         this.updateUI();
//     }

//     toggleSelectAll(selectAll: boolean): void {
//         if (selectAll) {
//             this.data.forEach(item => this.selectedItems.add(item.id));
//         } else {
//             this.selectedItems.clear();
//         }
//         this.render();
//     }

//     updateUI(): void {
//         const selectAllCheckbox = document.getElementById('selectAll') as HTMLInputElement;
//         const deleteButton = document.getElementById('deleteSelected') as HTMLButtonElement;

//         if (!selectAllCheckbox || !deleteButton) return;

//         // Update select all checkbox state
//         const allSelected = this.data.length > 0 && this.selectedItems.size === this.data.length;
//         const someSelected = this.selectedItems.size > 0;
        
//         selectAllCheckbox.checked = allSelected;
//         selectAllCheckbox.indeterminate = someSelected && !allSelected;

//         // Update delete button state
//         deleteButton.disabled = this.selectedItems.size === 0;
//         deleteButton.textContent = `Delete Selected (${this.selectedItems.size})`;

//         // Update item styling
//         this.data.forEach(item => {
//             const itemElement = document.getElementById(`item_${item.id}`)?.closest('.data-item') as HTMLElement;
//             if (itemElement) {
//                 itemElement.classList.toggle('selected', this.selectedItems.has(item.id));
//             }
//         });
//     }

//     async deleteSelected(): Promise<void> {
//         if (this.selectedItems.size === 0) return;

//         const itemsToDelete = Array.from(this.selectedItems);
//         const confirmMessage = `Are you sure you want to delete ${itemsToDelete.length} item(s)? This action cannot be undone.`;
        
//         if (!confirm(confirmMessage)) return;

//         try {
//             // Show loading state
//             const deleteButton = document.getElementById('deleteSelected') as HTMLButtonElement;
//             if (deleteButton) {
//                 deleteButton.textContent = 'Deleting...';
//                 deleteButton.disabled = true;
//             }

//             const deleteResult = await this.deleteUserDataFromFirebase(itemsToDelete);
            
//             if (deleteResult.success) {
//                 // Remove items from local data
//                 this.data = this.data.filter(item => !this.selectedItems.has(item.id));
//                 this.selectedItems.clear();

//                 // Re-render
//                 this.render();
//                 this.showStatus(`Successfully deleted ${itemsToDelete.length} item(s)`);
//             } else {
//                 throw new Error(deleteResult.error || 'Failed to delete items');
//             }

//         } catch (error) {
//             console.error('Error deleting items:', error);
//             this.showStatus('Error deleting items', 'error');
//         } finally {
//             // Reset button state
//             const deleteButton = document.getElementById('deleteSelected') as HTMLButtonElement;
//             if (deleteButton) {
//                 deleteButton.textContent = 'Delete Selected (0)';
//                 deleteButton.disabled = true;
//             }
//         }
//     }

//     async deleteUserDataFromFirebase(itemIds: string[]): Promise<{success: boolean, error?: string}> {
//         if (!this.userEmail || !itemIds.length) {
//             return { success: false, error: "Invalid parameters" };
//         }

//         try {
//             // Group items by session ID for efficient processing
//             const sessionIds = new Set<string>();
//             const itemsToDelete: {sessionId: string, type: 'session' | 'activity', activityIndex?: number}[] = [];
            
//             itemIds.forEach(itemId => {
//                 if (itemId.startsWith('session_')) {
//                     const sessionId = itemId.replace('session_', '');
//                     sessionIds.add(sessionId);
//                     itemsToDelete.push({ sessionId, type: 'session' });
//                 } else if (itemId.startsWith('activity_')) {
//                     // Format: activity_sessionId_index
//                     const parts = itemId.replace('activity_', '').split('_');
//                     const sessionId = parts.slice(0, -1).join('_'); // Handle session IDs with underscores
//                     const activityIndex = parseInt(parts[parts.length - 1]);
//                     sessionIds.add(sessionId);
//                     itemsToDelete.push({ sessionId, type: 'activity', activityIndex });
//                 }
//             });

//             // Get current session data for verification and processing
//             const sessionDataMap = new Map<string, any>();
            
//             for (const sessionId of sessionIds) {
//                 const q = query(collection(db, "userData"));
//                 const querySnapshot = await getDocs(q);
                
//                 let sessionData: any = null;
//                 querySnapshot.forEach((docSnapshot) => {
//                     if (docSnapshot.id === sessionId) {
//                         sessionData = docSnapshot.data();
//                     }
//                 });
                
//                 if (!sessionData) {
//                     throw new Error(`Session ${sessionId} not found`);
//                 }
                
//                 if (sessionData.sessionInfo?.email !== this.userEmail) {
//                     throw new Error(`Unauthorized access to session ${sessionId}`);
//                 }
                
//                 sessionDataMap.set(sessionId, sessionData);
//             }

//             // Process deletions
//             for (const sessionId of sessionIds) {
//                 const sessionDocRef = doc(db, "userData", sessionId);
//                 const originalData = sessionDataMap.get(sessionId);
                
//                 if (!originalData) continue;

//                 // Check if entire session should be deleted
//                 const sessionItems = itemsToDelete.filter(item => item.sessionId === sessionId);
//                 const shouldDeleteEntireSession = sessionItems.some(item => item.type === 'session');
                
//                 if (shouldDeleteEntireSession) {
//                     // Delete the entire session document
//                     await deleteDoc(sessionDocRef);
//                     console.log(`Deleted entire session: ${sessionId}`);
//                 } else {
//                     // Delete specific activities
//                     const activityIndicesToDelete = sessionItems
//                         .filter(item => item.type === 'activity')
//                         .map(item => item.activityIndex!)
//                         .sort((a, b) => b - a); // Sort in descending order for safe removal
                    
//                     if (activityIndicesToDelete.length > 0 && originalData.documents) {
//                         const updatedDocuments = [...originalData.documents];
                        
//                         // Remove activities in reverse order to maintain indices
//                         activityIndicesToDelete.forEach(index => {
//                             if (index >= 0 && index < updatedDocuments.length) {
//                                 updatedDocuments.splice(index, 1);
//                             }
//                         });
                        
//                         // Update the session with remaining activities
//                         await updateDoc(sessionDocRef, {
//                             documents: updatedDocuments
//                         });
                        
//                         console.log(`Deleted ${activityIndicesToDelete.length} activities from session: ${sessionId}`);
//                     }
//                 }
//             }
            
//             console.log(`Successfully processed deletion of ${itemIds.length} items`);
//             return { success: true };
            
//         } catch (error) {
//             console.error("Error deleting user data:", error);
//             return { 
//                 success: false, 
//                 error: error instanceof Error ? error.message : "Unknown error occurred"
//             };
//         }
//     }

//     showStatus(message: string, type: string = 'success'): void {
//         const statusElement = document.getElementById('statusMessage');
//         if (statusElement) {
//             statusElement.textContent = message;
//             statusElement.className = `status-message ${type}`;
//             statusElement.style.display = 'block';

//             setTimeout(() => {
//                 statusElement.style.display = 'none';
//             }, 3000);
//         }
//     }
// }

// // Initialize the data manager when the popup loads
// document.addEventListener('DOMContentLoaded', () => {
//     new DataManager();
// });

import { db } from "./database/firebase";
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

interface SessionData {
    id: string;
    sessionInfo: {
        email: string;
        startTime: string;
        endTime?: string;
        url: string;
        title: string;
    };
    activities: any[];
}

class DataManager {
    private sessions: SessionData[] = [];
    private selectedItems: Set<string> = new Set();
    private userEmail: string = '';

    constructor() {
        this.init();
    }

    async init(): Promise<void> {
        await this.getUserEmail();
        await this.loadData();
        this.setupEventListeners();
        this.render();
    }

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

    async getUserDataFromFirebase(): Promise<any[]> {
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
            const userData: any[] = [];
            
            querySnapshot.forEach((docSnapshot) => {
                userData.push({
                    id: docSnapshot.id,
                    ...docSnapshot.data()
                });
            });
            
            console.log(`Retrieved ${userData.length} sessions for user:`, this.userEmail);
            return userData;
        } catch (error) {
            console.error("Error getting user data from Firebase:", error);
            throw error;
        }
    }

    transformFirebaseData(firebaseData: any[]): SessionData[] {
        const sessions: SessionData[] = firebaseData.map(session => ({
            id: session.id,
            sessionInfo: session.sessionInfo || {},
            activities: session.documents || []
        }));

        // Sort sessions by start time (newest first)
        return sessions.sort((a, b) => {
            const timeA = new Date(a.sessionInfo.startTime || 0).getTime();
            const timeB = new Date(b.sessionInfo.startTime || 0).getTime();
            return timeB - timeA;
        });
    }

    setupEventListeners(): void {
        const selectAllCheckbox = document.getElementById('selectAll') as HTMLInputElement;
        const deleteButton = document.getElementById('deleteSelected') as HTMLButtonElement;

        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                this.toggleSelectAll((e.target as HTMLInputElement).checked);
            });
        }

        if (deleteButton) {
            deleteButton.addEventListener('click', () => {
                this.deleteSelected();
            });
        }
    }

    render(): void {
        const container = document.getElementById('dataContainer');
        if (!container) return;
        
        if (this.sessions.length === 0) {
            container.innerHTML = '<div class="no-data">No data found</div>';
            return;
        }

        // Clear container
        container.innerHTML = '';
        
        // Create session elements
        this.sessions.forEach(session => {
            const sessionElement = this.createSessionElement(session);
            container.appendChild(sessionElement);
        });

        this.updateUI();
    }

    baseName(url: String)
    {
    let base = url.split(".")[1]
    return base;
    }

    createSessionElement(session: SessionData): HTMLElement {
        const sessionDiv = document.createElement('div');
        sessionDiv.className = 'session-group';
        
        const startTime = new Date(session.sessionInfo.startTime || '').toLocaleString();
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
                    <span class="session-title">📋 ${session.id} - ${this.baseName(session.sessionInfo.url)}</span>
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

    createActivityElement(activity: any, sessionId: string, index: number): HTMLElement {
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
        
        // Set JSON content as text
        const preElement = activityDiv.querySelector('pre');
        if (preElement) {
            preElement.textContent = JSON.stringify(activity, null, 2);
        }
        
        // Add event listener for activity checkbox
        const checkbox = activityDiv.querySelector(`#${activityId}`) as HTMLInputElement;
        if (checkbox) {
            checkbox.addEventListener('change', (e) => {
                this.toggleItemSelection(activityId, (e.target as HTMLInputElement).checked);
            });
        }
        
        return activityDiv;
    }

    addSessionEventListeners(sessionDiv: HTMLElement, session: SessionData): void {
        // Session checkbox
        const sessionCheckbox = sessionDiv.querySelector(`#session_${session.id}`) as HTMLInputElement;
        if (sessionCheckbox) {
            sessionCheckbox.addEventListener('change', (e) => {
                this.toggleSessionSelection(session.id, (e.target as HTMLInputElement).checked);
            });
        }
        
        // Toggle button
        const toggleButton = sessionDiv.querySelector('.toggle-activities') as HTMLButtonElement;
        if (toggleButton) {
            toggleButton.addEventListener('click', () => {
                this.toggleSessionExpansion(session.id);
            });
        }
    }

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
        this.render();
    }

    private expandedSessions: Set<string> = new Set();

    toggleSessionExpansion(sessionId: string): void {
        if (this.expandedSessions.has(sessionId)) {
            this.expandedSessions.delete(sessionId);
        } else {
            this.expandedSessions.add(sessionId);
        }
        this.render();
    }

    isSessionExpanded(sessionId: string): boolean {
        return this.expandedSessions.has(sessionId);
    }

    updateUI(): void {
        const selectAllCheckbox = document.getElementById('selectAll') as HTMLInputElement;
        const deleteButton = document.getElementById('deleteSelected') as HTMLButtonElement;

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
        deleteButton.textContent = `Delete Selected`;

        // Update item styling
        this.sessions.forEach(session => {
            // Update session styling
            const sessionElement = document.getElementById(`session_${session.id}`)?.closest('.session-group') as HTMLElement;
            if (sessionElement) {
                sessionElement.classList.toggle('selected', this.selectedItems.has(`session_${session.id}`));
            }
            
            // Update activity styling
            session.activities.forEach((_, index) => {
                const activityId = `activity_${session.id}_${index}`;
                const activityElement = document.getElementById(activityId)?.closest('.activity-item') as HTMLElement;
                if (activityElement) {
                    activityElement.classList.toggle('selected', this.selectedItems.has(activityId));
                }
            });
        });
    }

    async deleteSelected(): Promise<void> {
        if (this.selectedItems.size === 0) return;

        const itemsToDelete = Array.from(this.selectedItems);
        const confirmMessage = `Are you sure you want to delete ${itemsToDelete.length} item(s)? This action cannot be undone.`;
        
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
                this.showStatus(`Successfully deleted ${itemsToDelete.length} item(s)`);
            } else {
                throw new Error(deleteResult.error || 'Failed to delete items');
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

    async deleteUserDataFromFirebase(itemIds: string[]): Promise<{success: boolean, error?: string}> {
        if (!this.userEmail || !itemIds.length) {
            return { success: false, error: "Invalid parameters" };
        }

        try {
            // Group items by session ID for efficient processing
            const sessionIds = new Set<string>();
            const itemsToDelete: {sessionId: string, type: 'session' | 'activity', activityIndex?: number}[] = [];
            
            itemIds.forEach(itemId => {
                if (itemId.startsWith('session_')) {
                    const sessionId = itemId.replace('session_', '');
                    sessionIds.add(sessionId);
                    itemsToDelete.push({ sessionId, type: 'session' });
                } else if (itemId.startsWith('activity_')) {
                    // Format: activity_sessionId_index
                    const parts = itemId.replace('activity_', '').split('_');
                    const sessionId = parts.slice(0, -1).join('_');
                    const activityIndex = parseInt(parts[parts.length - 1]);
                    sessionIds.add(sessionId);
                    itemsToDelete.push({ sessionId, type: 'activity', activityIndex });
                }
            });

            // Get current session data for verification and processing
            const sessionDataMap = new Map<string, any>();
            
            for (const sessionId of sessionIds) {
                const q = query(collection(db, "userData"));
                const querySnapshot = await getDocs(q);
                
                let sessionData: any = null;
                querySnapshot.forEach((docSnapshot) => {
                    if (docSnapshot.id === sessionId) {
                        sessionData = docSnapshot.data();
                    }
                });
                
                if (!sessionData) {
                    throw new Error(`Session ${sessionId} not found`);
                }
                
                if (sessionData.sessionInfo?.email !== this.userEmail) {
                    throw new Error(`Unauthorized access to session ${sessionId}`);
                }
                
                sessionDataMap.set(sessionId, sessionData);
            }

            // Process deletions
            for (const sessionId of sessionIds) {
                const sessionDocRef = doc(db, "userData", sessionId);
                const originalData = sessionDataMap.get(sessionId);
                
                if (!originalData) continue;

                // Check if entire session should be deleted
                const sessionItems = itemsToDelete.filter(item => item.sessionId === sessionId);
                const shouldDeleteEntireSession = sessionItems.some(item => item.type === 'session');
                
                if (shouldDeleteEntireSession) {
                    // Delete the entire session document
                    await deleteDoc(sessionDocRef);
                    console.log(`Deleted entire session: ${sessionId}`);
                } else {
                    // Delete specific activities
                    const activityIndicesToDelete = sessionItems
                        .filter(item => item.type === 'activity')
                        .map(item => item.activityIndex!)
                        .sort((a, b) => b - a); // Sort in descending order for safe removal
                    
                    if (activityIndicesToDelete.length > 0 && originalData.documents) {
                        const updatedDocuments = [...originalData.documents];
                        
                        // Remove activities in reverse order to maintain indices
                        activityIndicesToDelete.forEach(index => {
                            if (index >= 0 && index < updatedDocuments.length) {
                                updatedDocuments.splice(index, 1);
                            }
                        });
                        
                        // Update the session with remaining activities
                        await updateDoc(sessionDocRef, {
                            documents: updatedDocuments
                        });
                        
                        console.log(`Deleted ${activityIndicesToDelete.length} activities from session: ${sessionId}`);
                    }
                }
            }
            
            console.log(`Successfully processed deletion of ${itemIds.length} items`);
            return { success: true };
            
        } catch (error) {
            console.error("Error deleting user data:", error);
            return { 
                success: false, 
                error: error instanceof Error ? error.message : "Unknown error occurred"
            };
        }
    }

    showStatus(message: string, type: string = 'success'): void {
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

// Initialize the data manager when the popup loads
document.addEventListener('DOMContentLoaded', () => {
    new DataManager();
});