// Handles background tasks such as coordinating data from different real estate sites and running the AI processing.

chrome.runtime.onInstalled.addListener(() => {
    console.log('Unified Real Estate Analyzer installed');
});



chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // if (changeInfo.status === 'complete') {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['src/content.js']
        });
    // }
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

