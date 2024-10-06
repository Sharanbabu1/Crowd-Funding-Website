// fundraiser.js
const params = new URLSearchParams(window.location.search);
const fundraiserId = params.get('id');

window.onload = function() {
    // Fetch fundraiser details
    fetch(`/api/fundraiser/${fundraiserId}`)
        .then(response => response.json())
        .then(fundraiser => {
            document.getElementById('fundraiserTitle').textContent = fundraiser.CAPTION;
            document.getElementById('goal').textContent = fundraiser.TARGET_FUNDING;
            document.getElementById('raised').textContent = fundraiser.CURRENT_FUNDING;
            document.getElementById('city').textContent = fundraiser.CITY;
            document.getElementById('organizer').textContent = fundraiser.ORGANIZER;
        })
        .catch(error => console.error('Error fetching fundraiser details:', error));

    // Fetch donations for the fundraiser
    fetch(`/api/fundraiser/${fundraiserId}/donations`)
        .then(response => response.json())
        .then(donations => {
            const donationResults = document.getElementById('donationResults');
            if (donations.length === 0) {
                donationResults.innerHTML = '<p>No donations yet.</p>';
                return;
            }

            donations.forEach(donation => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <p><strong>Donor:</strong> ${donation.GIVER}</p>
                    <p><strong>Amount:</strong> $${donation.AMOUNT}</p>
                    <p><strong>Date:</strong> ${new Date(donation.DATE).toLocaleDateString()}</p>
                `;
                donationResults.appendChild(div);
            });
        })
        .catch(error => console.error('Error fetching donations:', error));
};

// Handle donation button click
document.getElementById('donateButton').addEventListener('click', () => {
    window.location.href = `/donation?id=${fundraiserId}`;
});
