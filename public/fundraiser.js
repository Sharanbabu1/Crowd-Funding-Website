document.addEventListener('DOMContentLoaded', function () {
    const fundraiserDetails = document.querySelector('#fundraiserDetails');
    const donationList = document.querySelector('#donationList');
    const donateButton = document.querySelector('#donateButton');
    const params = new URLSearchParams(window.location.search);
    const fundraiserId = params.get('id'); // Get fundraiser ID from query string

    // Function to fetch fundraiser details and donations
    function fetchFundraiser() {
        if (fundraiserId) {
            // Fetch fundraiser details
            fetch(`/fundraiser/${fundraiserId}`) // Assuming this API returns fundraiser details by ID
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch fundraiser details.');
                    }
                    return response.json();
                })
                .then(fundraiser => {
                    fundraiserDetails.innerHTML = `
                        <h3>${fundraiser.title}</h3>
                        <p>Goal: $${fundraiser.goal} | Raised: $${fundraiser.raised}</p>
                        <p>${fundraiser.description}</p>
                    `;
                    fetchDonations(); // Fetch donations after details
                })
                .catch(error => {
                    console.error('Error:', error);
                    fundraiserDetails.innerHTML = 'Error loading fundraiser details. Please try again later.';
                });
        } else {
            fundraiserDetails.innerHTML = 'No fundraiser ID provided.';
        }
    }

    // Function to fetch donations for the fundraiser
    function fetchDonations() {
        fetch(`/donations/${fundraiserId}`) // Assuming this API returns donations for the fundraiser
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch donations.');
                }
                return response.json();
            })
            .then(donations => {
                donations.forEach(donation => {
                    const li = document.createElement('li');
                    li.textContent = `${donation.giver} donated $${donation.amount}`;
                    donationList.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Error:', error);
                donationList.innerHTML = 'Error loading donations. Please try again later.';
            });
    }

    // Update the donate button to redirect to the donation page
    donateButton.addEventListener('click', function () {
        window.location.href = `/donation?id=${fundraiserId}`; // Redirect to the donation page with the fundraiser ID
    });

    fetchFundraiser(); // Fetch fundraiser details on page load
});
