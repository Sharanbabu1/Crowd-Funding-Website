// Event listener for form submission
document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission

    // Get input values from the form
    const organizer = document.getElementById('organizer').value.trim();
    const city = document.getElementById('city').value.trim();
    const category = document.getElementById('category').value;

    // Log the search parameters for debugging
    console.log(`Searching for: Organizer: ${organizer}, City: ${city}, Category: ${category}`);

    // Show loading indicator while fetching data
    showLoadingIndicator();

    // Fetch search results from the backend
    fetch(`/search?organizer=${encodeURIComponent(organizer)}&city=${encodeURIComponent(city)}&category=${encodeURIComponent(category)}`)
        .then(response => {
            // Check if the response is ok (status in the range 200-299)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the JSON data
        })
        .then(data => {
            hideLoadingIndicator(); // Hide loading indicator

            // Log the fetched data for debugging
            console.log('Fetched data:', data);

            // Reference to the results container
            const fundraiserResults = document.getElementById('fundraiserResults');
            fundraiserResults.innerHTML = ''; // Clear previous results

            // Check if there are results and display them
            if (data.length > 0) {
                data.forEach(fundraiser => {
                    fundraiserResults.appendChild(createFundraiserItem(fundraiser)); // Create and append fundraiser item
                });
            } else {
                fundraiserResults.innerHTML = '<p>No fundraisers found.</p>'; // Display no results message
            }
        })
        .catch(error => {
            hideLoadingIndicator(); // Hide loading indicator on error
            console.error('Error fetching data:', error); // Log error for debugging

            // Show an error message in the results container
            const fundraiserResults = document.getElementById('fundraiserResults');
            fundraiserResults.innerHTML = '<p>An error occurred while fetching data. Please try again later.</p>';
        });
});

// Function to create a fundraiser item element
function createFundraiserItem(fundraiser) {
    const item = document.createElement('div'); // Create a new div for the fundraiser
    item.className = 'fundraiser-item'; // Set the class name for styling
    item.innerHTML = `
        <h3>${fundraiser.caption}</h3> <!-- Fundraiser title -->
        <p>Organizer: ${fundraiser.organizer}</p> <!-- Organizer name -->
        <p>City: ${fundraiser.city}</p> <!-- City -->
        <p>Current Funding: $${fundraiser.current_funding}</p> <!-- Current funding amount -->
        <p>Target Funding: $${fundraiser.target_funding}</p> <!-- Target funding amount -->
        <a href="/fundraiser/${fundraiser.fundraiser_id}">View Details</a> <!-- Link to view details -->
    `;
    return item; // Return the created item
}

// Function to show loading indicator
function showLoadingIndicator() {
    const fundraiserResults = document.getElementById('fundraiserResults');
    fundraiserResults.innerHTML = '<p>Loading...</p>'; // Show loading message
}

// Function to hide loading indicator
function hideLoadingIndicator() {
    const fundraiserResults = document.getElementById('fundraiserResults');
    const loadingMessage = fundraiserResults.querySelector('p'); // Reference to loading message
    if (loadingMessage) {
        loadingMessage.style.display = 'none'; // Hide loading message
    }
}
