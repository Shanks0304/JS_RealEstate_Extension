// Handles data scraping from real estate websites and sends relevant data to the background script for processing.
function delaytime(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function getText(selector) {
    return document.querySelector(selector)?.innerText || '';
}
function selectAll(array) {
    return document.querySelectorAll(array);
}
// have to wait 0.3 second while page is loading.
async function waitAndScrapeData() {

    if (window.location.hostname.includes('zillow.com') ||
        window.location.hostname.includes('redfin.com') ||
        window.location.hostname.includes('trulia.com')) {

        await delaytime(1);
        let propertyDetails = {
            images: [],
            views: "",
            saves: "",
            estimations: [],
            price: "",
            fsquare: "",
            num_bed: "",
            num_baths: "",
            lotsize: "",
            address: "",
            property: "",
            nearschool: "",
            image: "",
            imagesrc: [],
            spans: [],
            chartElement: [],
            pricehistory: "",
            h_date: [],
            h_event: [],
            h_price: [],
        };

        try {
            propertyDetails.spans = selectAll("#search-detail-lightbox  span");
            // page loaded
            if (propertyDetails.spans.length > 0) {
                // scrap price 
                for (i = 0; i < propertyDetails.spans.length; i++) {
                    span = propertyDetails.spans[i].innerText;
                    if (span[0] === '$') {
                        propertyDetails.price = span;
                        break;
                    }
                }
                // scrap bedroom number 
                for (i++; i < propertyDetails.spans.length; i++) {
                    span = propertyDetails.spans[i].innerText;
                    if (span[0] >= '0' && span[0] <= '9') {
                        propertyDetails.num_bed = span;
                        break;
                    }
                }
                // scrap sqft 
                span = propertyDetails.spans[i + 4].innerText;
                i += 4;
                // scrap lot sqft 
                propertyDetails.fsquare = span;
                propertyDetails.spans = selectAll("#search-detail-lightbox  div > div > div:nth-child(3) > span");
                for (i = 2; i < propertyDetails.spans.length; i++) {
                    span = propertyDetails.spans[i].innerText;
                    if (span.includes(propertyDetails.fsquare)) {
                        continue;
                    }
                    if (span[0] >= '0' && span[0] <= '9') {
                        propertyDetails.lotsize = span;
                        break;
                    }
                }
                try {
                    // scrap views and saves 
                    propertyDetails.spans = selectAll("#search-detail-lightbox dt");
                    if (propertyDetails.spans.length > 0) {
                        for (let i = 0; i < propertyDetails.spans.length; i++) {
                            let span = propertyDetails.spans[i].innerText;
                            if (span.includes("views")) {
                                propertyDetails.views = propertyDetails.spans[i - 1].innerText;
                                break;
                            }
                        }
                        for (i++; i < propertyDetails.spans.length; i++) {
                            span = propertyDetails.spans[i].innerText;
                            if (span.includes("saves")) {
                                propertyDetails.saves = propertyDetails.spans[i - 1].innerText;
                                break;
                            }
                        }
                    }
                } catch { }
            }
            // scrap bathroom number
            propertyDetails.num_baths = getText("#search-detail-lightbox  button > div > span");
            // scrap address
            propertyDetails.address = getText("#search-detail-lightbox  div > h1");
            // scrap nearschool 
            propertyDetails.nearschool = getText("#search-detail-lightbox  ul > li:nth-child(1) > div > a");
        } catch {
            console.log("data scrap fail");
        }
        try {
            let cnt = 0;
            propertyDetails.spans = selectAll("#search-detail-lightbox table > tbody > tr > td > span");
            // alert(propertyDetails.spans.length);
            for (i = 0; i < propertyDetails.spans.length; i++) {
                span = propertyDetails.spans[i].innerText;
                // alert(span);
                if (span[0] >= '0' && span[0] <= '9' && span.includes('/')) {
                    // alert(span);
                    propertyDetails.h_date[cnt] = span;
                    span = propertyDetails.spans[i + 1].innerText;
                    propertyDetails.h_event[cnt] = span;
                    span = propertyDetails.spans[i + 2].innerText;
                    propertyDetails.h_price[cnt] = span;
                    // i++;
                    cnt++;
                }
            }

        } catch { }
        try {
            // scrap image src
            propertyDetails.images = selectAll("#search-detail-lightbox  div > div  button picture > img");
            if (propertyDetails.images.length > 0) {
                for (i = 0; i < propertyDetails.images.length; i++) {
                    propertyDetails.imagesrc[i] = propertyDetails.images[i].src;
                }
            }
        } catch {
            console.log("error");
        }

        chrome.runtime.sendMessage({ action: 'processImages', images: propertyDetails.images }, response => {
            propertyDetails.processedImages = response;
        });

        chrome.storage.local.set({ propertyDetails: propertyDetails });
    }
}

waitAndScrapeData();