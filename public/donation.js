// donation.js

document.addEventListener('DOMContentLoaded', () => {
    fetchDonations(); // Fetch donations when the page loads
});

function fetchDonations() {
    console.log('Fetching donations...'); // Log when fetching starts

    fetch('/api/donations')
        .then(response => {
            console.log('Response:', response); // Log the response
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Donations data:', data); // Log the donations data
            populateDonationList(data); // Call to populate the donations
        })
        .catch(error => {
            console.error('Error fetching donations:', error);
            document.getElementById('errorMessage').innerText = 'An error occurred while fetching donations.';
        });
}

function populateDonationList(donations) {
    const donationList = document.getElementById('donationList');
    donationList.innerHTML = ''; // Clear the current list

    if (donations.length > 0) {
        donations.forEach(donation => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>Donation ID:</strong> ${donation.id} <br>
                <strong>Date:</strong> ${donation.date} <br>
                <strong>Amount:</strong> $${donation.amount.toFixed(2)} <br>
                <strong>Giver:</strong> ${donation.giver} <br>
                <strong>Fundraiser ID:</strong> ${donation.fundraiserId}
            `;
            donationList.appendChild(listItem);
        });
    } else {
        donationList.innerHTML = '<li>No donations found.</li>'; // No donations
    }
}
