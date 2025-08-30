// Saves options to chrome.storage
const saveOptions = (): void => {
  const highlightElements = (
    document.getElementById("highlightElements") as HTMLInputElement
  ).checked
  const useDB = (document.getElementById("useDB") as HTMLInputElement).checked

  chrome.storage.sync.set({ highlightElements, useDB }, () => {
    // Update status to let user know options were saved.
    const status = document.getElementById("status")!
    if (status) {
      status.textContent = "Options saved."
      setTimeout(() => {
        status.textContent = ""
      }, 750)
    }
  })
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = (): void => {
  chrome.storage.sync.get(
    { highlightElements: true, useDB: false },
    (items: { highlightElements: boolean; useDB: boolean }) => {
      ;(
        document.getElementById("highlightElements") as HTMLInputElement
      ).checked = items.highlightElements
      ;(document.getElementById("useDB") as HTMLInputElement).checked =
        items.useDB
    },
  )
}

document.addEventListener("DOMContentLoaded", restoreOptions)

document.getElementById("save")!.addEventListener("click", saveOptions)
