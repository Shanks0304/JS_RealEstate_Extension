// Fetches and displays insights about properties from the collected data.

document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get('propertyDetails', function (result) {
        let insightsDiv = document.getElementById('insights');
        let propertyDetails = result.propertyDetails;
        try {
            if (propertyDetails.address) {
                let imageElements = (propertyDetails.imagesrc || []).map((src, index) => {
                    if (src) { // Check if src is not null or undefined
                        return `<img src="${src}" alt="Image ${index + 1}"${index === 0 ? ' class="active"' : ''}>`;
                    }
                    return ''; // Return an empty string for null or invalid sources
                }).join('');
                // show elements
                insightsDiv.innerHTML = `
                <h3>${propertyDetails.address}</h3>
                <table class="property-table">
                    <thead>
                        <tr>
                        <th>Attribute</th>
                        <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Views</td>
                            <td>${propertyDetails.views}</td>
                        </tr>
                        <tr>
                            <td>Saves</td>
                            <td>${propertyDetails.saves}</td>
                        </tr>
                        <tr>
                            <td>Estimation</td>
                            <td>${propertyDetails.estimations.join(', ')}</td>
                        </tr>
                        <tr>
                            <td>Price</td>
                            <td>${propertyDetails.price}</td>
                        </tr>
                        <tr>
                            <td>Number of Bed</td>
                            <td>${propertyDetails.num_bed}</td>
                        </tr>
                        <tr>
                            <td>Number of Bath</td>
                            <td>${propertyDetails.num_baths}</td>
                        </tr>
                        <tr>
                            <td>Square Footage</td>
                            <td>${propertyDetails.fsquare}sqft</td>
                        </tr>
                        <tr>
                            <td>Lot Size</td>
                            <td>${propertyDetails.lotsize}</td>
                        </tr>
                        <tr>
                            <td>Property Type</td>
                            <td>${propertyDetails.property}</td>
                        </tr>
                        <tr>
                            <td>Near School</td>
                            <td>${propertyDetails.nearschool}</td>
                        </tr>
                    </tbody>
                </table>
                <br/>
                <div id="carousel" class="carousel" style="position: relative;">
                    <div class="carousel-images" style="position: relative;">
                        ${imageElements}
                    </div>
                    <button class="carousel-control prev" id="prev" style="position: absolute; top: 144px; left: 10px; transform: translateY(-50%); background: none; border: none; width: 36px; height: 28.8px;">
                        <img src="prev.png" alt="Previous" style="width: 100%; height: 100%;">
                    </button>
                    <button class="carousel-control next" id="next" style="position: absolute; top: 144px; right: 10px; transform: translateY(-50%); background: none; border: none; width: 36px; height: 28.8px;">
                        <img src="next.png" alt="Next" style="width: 100%; height: 100%;">
                    </button>
                </div>
                <div width="100%" id="screenshot"></div>
            `;
                let tableBody = `<table class="history-table" id="historyprice">
                    <thead>
                    <tr>
                    <th>Date</th>
                    <th>Event</th>
                    <th>Price</th>
                    </tr>
                </thead>
                <tbody>`
                for (let i = 0; i < propertyDetails.h_date.length; i++) {
                    const row = `
                    <tr>
                        <td>${propertyDetails.h_date[i]}</td>
                        <td>${propertyDetails.h_event[i]}</td>
                        <td>${propertyDetails.h_price[i]}</td>
                    </tr>
                `;
                    tableBody += row;
                }
                tableBody  += `</tbody></table>`
                insightsDiv.innerHTML += tableBody;

                // Initialize the carousel controls after the HTML content has been generated.
                const prevButton = document.getElementById("prev");
                const nextButton = document.getElementById("next");

                // Add event listeners to the buttons.
                prevButton.addEventListener("click", function () {
                    moveSlide(-1);
                    resetCarouselInterval(); // Reset the interval for automatic change after manual control.
                });

                nextButton.addEventListener("click", function () {
                    moveSlide(1);
                    resetCarouselInterval(); // Reset the interval for automatic change after manual control.
                });
                let slides = document.querySelectorAll('.carousel-images img');
                if (slides.length > 0) {
                    slides[0].style.opacity = 1;
                    slides[0].classList.add('active');
                }
                startCarousel();
            }
            else {
                insightsDiv.innerHTML = '<p>No property data available.</p>';
            }
        } catch {
            insightsDiv.innerHTML = "<p>No property data available.</p>";
        }
    });
});



function moveSlide(direction) {
    let slides = document.querySelectorAll('.carousel-images img');
    if (slides.length > 0) {
        let currentSlideIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));

        let nextIndex = (currentSlideIndex + direction + slides.length) % slides.length;

        // Set the next index as active and manage opacity
        slides[currentSlideIndex].classList.remove('active');
        setTimeout(() => {
            slides[currentSlideIndex].style.opacity = 0; // Hide the previous slide
            slides[nextIndex].classList.add('active');
            slides[nextIndex].style.opacity = 1; // Show the next slide
        }, 1000); // Slightly longer to ensure the active class is toggled after the fade out
    }
}
let intervalID; // Variable to keep track of the setInterval

function resetCarouselInterval() {
    clearInterval(intervalID);
    intervalID = setInterval(() => {
        moveSlide(1);
    }, 1500); // Adjust the time to your preferred interval for automatic change.
}

function startCarousel() {
    // Only start the carousel if there's more than one slide
    const slides = document.querySelectorAll('.carousel-images img');
    if (slides.length > 1) {
        intervalID = setInterval(() => {
            moveSlide(1);
        }, 1500); // Change every 5 seconds
    }
}  
