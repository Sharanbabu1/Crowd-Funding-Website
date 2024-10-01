//sharan adhikari 24071844
document.addEventListener('DOMContentLoaded', () => {
    // Wait for the DOM to be fully loaded before executing the following code

    fetch('http://localhost:3000/fundraisers') // Fetch the list of fundraisers from the server
        .then(response => response.json()) // Convert the response to JSON
        .then(data => {
            const list = document.getElementById('fundraisers-list'); // Get the element to display the fundraisers
            data.forEach(fundraiser => { // Loop through each fundraiser
                const fundraiserDiv = document.createElement('div'); // Create a new div element
                fundraiserDiv.className = 'fundraiser'; // Assign a class to the div
                fundraiserDiv.innerHTML = `
                    <h3>${fundraiser.Caption}</h3> <!-- Display fundraiser caption -->
                    <p>Organiser: ${fundraiser.Organiser}</p> <!-- Display organiser name -->
                    <p>Target Funding: ${fundraiser.TargetFunding} AUD</p> <!-- Display target funding amount -->
                    <p>Current Funding: ${fundraiser.CurrentFunding} AUD</p> <!-- Display current funding amount -->
                    <p>City: ${fundraiser.City}</p> <!-- Display city -->
                    <p>Category: ${fundraiser.Category}</p> <!-- Display category -->
                    <p>Status: ${fundraiser.Active ? 'Active' : 'Inactive'}</p> <!-- Display status -->
                    <a href="fundraiser.html?id=${fundraiser.ID}">View Details</a> <!-- Link to fundraiser details page -->
                `;
                list.appendChild(fundraiserDiv); // Add the new div to the list
            });
        })
        .catch(error => console.error('Error fetching fundraisers:', error)); // Log any errors
});
