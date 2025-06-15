class DataManager {
    constructor() {
        this.data = [];
        this.selectedItems = new Set();
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.render();
    }

    async loadData() {
        try {
            // Simulate loading data from your NoSQL database
            // Replace this with your actual data loading logic
            // await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Sample data - replace with your actual data fetching
            this.data = [
                {
                    id: 'user_123_1',
                    timestamp: new Date('2024-01-15T10:30:00').toISOString(),
                    data: {
                        action: 'page_visit',
                        url: 'https://example.com/page1',
                        duration: 45000,
                        metadata: { browser: 'Chrome', version: '120.0' }
                    }
                },
                {
                    id: 'user_123_2',
                    timestamp: new Date('2024-01-14T14:22:00').toISOString(),
                    data: {
                        action: 'form_submission',
                        form_id: 'contact_form',
                        fields: ['name', 'email', 'message'],
                        success: true
                    }
                },
                {
                    id: 'user_123_3',
                    timestamp: new Date('2024-01-13T09:15:00').toISOString(),
                    data: {
                        action: 'search_query',
                        query: 'chrome extension development',
                        results_count: 12,
                        clicked_result: 3
                    }
                },
                {
                    id: 'user_123_4',
                    timestamp: new Date('2024-01-12T16:45:00').toISOString(),
                    data: {
                        action: 'button_click',
                        button_id: 'subscribe_newsletter',
                        page: '/home',
                        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
                    }
                },
                {
                    id: 'user_123_5',
                    timestamp: new Date('2024-01-11T11:30:00').toISOString(),
                    data: {
                        action: 'file_download',
                        filename: 'user_guide.pdf',
                        size: '2.4MB',
                        download_time: 3200
                    }
                }
            ];
        } catch (error) {
            console.error('Error loading data:', error);
            this.showStatus('Error loading data', 'error');
        }
    }

    setupEventListeners() {
        const selectAllCheckbox = document.getElementById('selectAll');
        const deleteButton = document.getElementById('deleteSelected');

        selectAllCheckbox.addEventListener('change', (e) => {
            this.toggleSelectAll(e.target.checked);
        });

        deleteButton.addEventListener('click', () => {
            this.deleteSelected();
        });
    }

    render() {
        const container = document.getElementById('dataContainer');
        
        if (this.data.length === 0) {
            container.innerHTML = '<div class="no-data">No data found</div>';
            return;
        }

        const itemsHtml = this.data.map(item => this.renderDataItem(item)).join('');
        container.innerHTML = itemsHtml;

        // Add event listeners to checkboxes
        this.data.forEach(item => {
            const checkbox = document.getElementById(`item_${item.id}`);
            checkbox.addEventListener('change', (e) => {
                this.toggleItemSelection(item.id, e.target.checked);
            });
        });

        this.updateUI();
    }

    renderDataItem(item) {
        const isSelected = this.selectedItems.has(item.id);
        const timestamp = new Date(item.timestamp).toLocaleString();
        const jsonContent = JSON.stringify(item.data, null, 2);

        return `
            <div class="data-item ${isSelected ? 'selected' : ''}">
                <div class="item-header">
                    <div class="item-checkbox">
                        <input type="checkbox" id="item_${item.id}" ${isSelected ? 'checked' : ''}>
                        <span class="item-id">${item.id}</span>
                    </div>
                    <span class="item-timestamp">${timestamp}</span>
                </div>
                <div class="item-content">
                    <pre>${jsonContent}</pre>
                </div>
            </div>
        `;
    }

    toggleItemSelection(itemId, isSelected) {
        if (isSelected) {
            this.selectedItems.add(itemId);
        } else {
            this.selectedItems.delete(itemId);
        }
        this.updateUI();
    }

    toggleSelectAll(selectAll) {
        if (selectAll) {
            this.data.forEach(item => this.selectedItems.add(item.id));
        } else {
            this.selectedItems.clear();
        }
        this.render();
    }

    updateUI() {
        const selectAllCheckbox = document.getElementById('selectAll');
        const deleteButton = document.getElementById('deleteSelected');

        // Update select all checkbox state
        const allSelected = this.data.length > 0 && this.selectedItems.size === this.data.length;
        const someSelected = this.selectedItems.size > 0;
        
        selectAllCheckbox.checked = allSelected;
        selectAllCheckbox.indeterminate = someSelected && !allSelected;

        // Update delete button state
        deleteButton.disabled = this.selectedItems.size === 0;
        deleteButton.textContent = `Delete Selected (${this.selectedItems.size})`;

        // Update item styling
        this.data.forEach(item => {
            const itemElement = document.getElementById(`item_${item.id}`)?.closest('.data-item');
            if (itemElement) {
                itemElement.classList.toggle('selected', this.selectedItems.has(item.id));
            }
        });
    }

    async deleteSelected() {
        if (this.selectedItems.size === 0) return;

        const itemsToDelete = Array.from(this.selectedItems);
        const confirmMessage = `Are you sure you want to delete ${itemsToDelete.length} item(s)? This action cannot be undone.`;
        
        if (!confirm(confirmMessage)) return;

        try {
            // Show loading state
            const deleteButton = document.getElementById('deleteSelected');
            const originalText = deleteButton.textContent;
            deleteButton.textContent = 'Deleting...';
            deleteButton.disabled = true;

            // Simulate API call to delete items
            // Replace this with your actual deletion logic
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Remove items from local data
            this.data = this.data.filter(item => !this.selectedItems.has(item.id));
            this.selectedItems.clear();

            // Re-render
            this.render();
            this.showStatus(`Successfully deleted ${itemsToDelete.length} item(s)`);

        } catch (error) {
            console.error('Error deleting items:', error);
            this.showStatus('Error deleting items', 'error');
        } finally {
            // Reset button state
            const deleteButton = document.getElementById('deleteSelected');
            deleteButton.textContent = 'Delete Selected (0)';
            deleteButton.disabled = true;
        }
    }

    showStatus(message, type = 'success') {
        const statusElement = document.getElementById('statusMessage');
        statusElement.textContent = message;
        statusElement.className = `status-message ${type}`;
        statusElement.style.display = 'block';

        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 3000);
    }
}

// Initialize the data manager when the popup loads
document.addEventListener('DOMContentLoaded', () => {
    new DataManager();
});