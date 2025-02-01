console.log('this page was updated!');
let selectors;

const url = chrome.runtime.getURL('selectors.json');

fetch(url)
    .then((response) => response.json())  // Assuming file contains JSON
    .then((json) => {
        selectors = json;
        console.log(selectors);  
		new Interactor({cssSelectors : selectors,
		})
    })
    .catch((error) => {
        console.error('Error loading selectors:', error);
    });

