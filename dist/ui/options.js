// Saves options to chrome.storage
const saveOptions = () => {
  const highlightElements = document.getElementById('highlightElements').checked;
  const useDB = document.getElementById('useDB').checked;

  chrome.storage.sync.set(
    { highlightElements: highlightElements, useDB: useDB},
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 750);
    }
  );
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.sync.get(
    {highlightElements: true, useDB: false},
    (items) => {
      document.getElementById('highlightElements').checked = items.highlightElements;
      document.getElementById('useDB').checked = items.useDB;
    }
  );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);