// fundraisers.js
window.onload = function() {
    fetch('/api/fundraisers/active') // API route to fetch active fundraisers
        .then(response => response.json())
        .then(fundraisers => {
            const fundraiserList = document.getElementById('fundraiserList');
            if (fundraisers.length === 0) {
                fundraiserList.innerHTML = '<p>No active fundraisers available.</p>';
                return;
            }

            // Loop through each fundraiser and create a display block
            fundraisers.forEach(fundraiser => {
                const div = document.createElement('div');
                div.classList.add('fundraiser-item');
                div.innerHTML = `
                    <h3>${fundraiser.CAPTION}</h3>
                    <p>Organizer: ${fundraiser.ORGANIZER}</p>
                    <p>Target Funding: $${fundraiser.TARGET_FUNDING}</p>
                    <p>Current Funding: $${fundraiser.CURRENT_FUNDING}</p>
                    <a href="/fundraiser?id=${fundraiser.FUNDRAISER_ID}">View Details</a>
                `;
                fundraiserList.appendChild(div);
            });
        })
        .catch(error => {
            console.error('Error fetching fundraisers:', error);
            document.getElementById('fundraiserList').innerHTML = '<p>Error loading fundraisers.</p>';
        });
};
