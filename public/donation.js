document.addEventListener('DOMContentLoaded', function () {
    const donationForm = document.querySelector('#donationForm');
    const fundraiserDetails = document.querySelector('#fundraiserDetails');
    const donationList = document.querySelector('#donationList');
    const errorMessage = document.querySelector('#errorMessage');

    // Fetch fundraiser details
    function fetchFundraiserDetails() {
        const params = new URLSearchParams(window.location.search);
        const fundraiserId = params.get('id'); // Get fundraiser ID from query string

        fetch(`/fundraiser/${fundraiserId}`) // Adjust the API endpoint as needed
            .then(response => response.json())
            .then(data => {
                // Display fundraiser details
                fundraiserDetails.innerHTML = `
                    <h3>${data.title}</h3>
                    <p>Goal: $${data.goal} | Raised: $${data.raised}</p>
                    <p>${data.description}</p>
                `;
                // Fetch donations
                fetchDonations(fundraiserId);
            })
            .catch(error => {
                console.error('Error fetching fundraiser details:', error);
                fundraiserDetails.innerHTML = '<p>Error loading fundraiser details.</p>';
            });
    }

    // Fetch donations for the fundraiser
    function fetchDonations(fundraiserId) {
        fetch(`/fundraiser/${fundraiserId}/donations`) // Adjust the API endpoint as needed
            .then(response => response.json())
            .then(donations => {
                donationList.innerHTML = '';
                donations.forEach(donation => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${donation.giver} donated $${donation.amount}`;
                    donationList.appendChild(listItem);
                });
            })
            .catch(error => {
                console.error('Error fetching donations:', error);
                donationList.innerHTML = '<p>Error loading donations.</p>';
            });
    }

    // Handle donation form submission
    donationForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const amount = document.querySelector('#amount').value;
        const giver = document.querySelector('#giver').value;
        const params = new URLSearchParams(window.location.search);
        const fundraiserId = params.get('id'); // Get fundraiser ID from query string

        // Validate donation amount
        if (amount < 5) {
            errorMessage.textContent = 'Minimum donation amount is 5 AUD.';
            return;
        } else {
            errorMessage.textContent = '';
        }

        // Submit donation
        fetch(`/fundraiser/${fundraiserId}/donations`, { // Adjust the API endpoint as needed
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: amount,
                giver: giver
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Show thank you message and redirect
            alert(`Thank you for your donation to ${data.fundraiser_name}`);
            window.location.href = `/fundraiser.html?id=${fundraiserId}`; // Redirect to fundraiser page
        })
        .catch(error => {
            console.error('Error submitting donation:', error);
            errorMessage.textContent = 'Error submitting donation. Please try again later.';
        });
    });

    fetchFundraiserDetails(); // Initial load of fundraiser details
});
