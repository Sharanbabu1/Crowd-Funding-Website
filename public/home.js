// Ensure the DOM is fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {

    // Fetch the list of active fundraisers from the updated API endpoint
    fetch('http://localhost:3000/api/fundraisers/active')
        .then(response => response.json()) // Convert the response to JSON
        .then(data => {
            const list = document.getElementById('fundraisers-list'); // Get the element where fundraisers will be displayed

            list.innerHTML = ''; // Clear the existing content, if any

            if (data.length === 0) {
                list.innerHTML = '<p>No active fundraisers available at the moment.</p>';
            } else {
                // Loop through each fundraiser and create HTML elements to display it
                data.forEach(fundraiser => {
                    const fundraiserDiv = document.createElement('div'); // Create a new div for each fundraiser
                    fundraiserDiv.className = 'fundraiser'; // Assign a CSS class to the div

                    // Populate the div with fundraiser details
                    fundraiserDiv.innerHTML = `
                        <h3>${fundraiser.TITLE}</h3> <!-- Display the fundraiser title -->
                        <p>Organiser: ${fundraiser.ORGANISER}</p> <!-- Display the organiser's name -->
                        <p>Target Funding: ${fundraiser.GOAL} AUD</p> <!-- Display the target funding -->
                        <p>Current Funding: ${fundraiser.CURRENT_FUNDING} AUD</p> <!-- Display current funding amount -->
                        <p>City: ${fundraiser.CITY}</p> <!-- Display the city -->
                        <p>Category: ${fundraiser.CATEGORY_ID}</p> <!-- Display the category (ID for now) -->
                        <p>Status: Active</p> <!-- Display the status as 'Active' -->
                        <a href="fundraiser.html?id=${fundraiser.FUNDRAISER_ID}">View Details</a> <!-- Link to fundraiser details page -->
                    `;

                    // Append the new div to the list container
                    list.appendChild(fundraiserDiv);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching active fundraisers:', error); // Log any errors
            const list = document.getElementById('fundraisers-list');
            list.innerHTML = '<p>Error loading fundraisers. Please try again later.</p>';
        });
});
