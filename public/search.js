document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const organizer = document.getElementById('organizer').value;
    const city = document.getElementById('city').value;
    const category = document.getElementById('category').value;

    showLoadingIndicator();

    fetch(`/search?organizer=${organizer}&city=${city}&category=${category}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            hideLoadingIndicator();
            const fundraiserResults = document.getElementById('fundraiserResults');
            fundraiserResults.innerHTML = ''; // Clear previous results

            if (data.length > 0) {
                data.forEach(fundraiser => {
                    fundraiserResults.appendChild(createFundraiserItem(fundraiser));
                });
            } else {
                fundraiserResults.innerHTML = '<p>No fundraisers found.</p>';
            }
        })
        .catch(error => {
            hideLoadingIndicator();
            console.error('Error fetching data:', error);
            const fundraiserResults = document.getElementById('fundraiserResults');
            fundraiserResults.innerHTML = '<p>An error occurred while fetching data. Please try again later.</p>';
        });
});

function createFundraiserItem(fundraiser) {
    const item = document.createElement('div');
    item.className = 'fundraiser-item';
    item.innerHTML = `
        <h3>${fundraiser.caption}</h3>
        <p>Organizer: ${fundraiser.organizer}</p>
        <p>City: ${fundraiser.city}</p>
        <p>Current Funding: $${fundraiser.currentFunding}</p>
        <p>Target Funding: $${fundraiser.targetFunding}</p>
        <a href="/fundraiser/${fundraiser.fundraiserId}">View Details</a>
    `;
    return item;
}

function showLoadingIndicator() {
    const fundraiserResults = document.getElementById('fundraiserResults');
    fundraiserResults.innerHTML = '<p>Loading...</p>'; // Show loading message
}

function hideLoadingIndicator() {
    const fundraiserResults = document.getElementById('fundraiserResults');
    fundraiserResults.innerHTML = ''; // Clear loading message
}
