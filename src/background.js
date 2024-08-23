// Handles background tasks such as coordinating data from different real estate sites and running the AI processing.

chrome.runtime.onInstalled.addListener(() => {
    console.log('Unified Real Estate Analyzer installed');
});



chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    try{
    // if (changeInfo.status === 'complete') {
    if(tab.url && tab.url.startsWith('https')){
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['src/content.js']
        });
    }
    // }
    } catch(error) {
        console.log('Failed to inject script:', error);
    }
});

// background.js  


// Background task to combine and analyze images using AI
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === 'processImages') {
//         // Call the AI processing module
//         processImages(request.images, sendResponse);
//         return true; // Keeps the message channel open for async response
//     }
// });

