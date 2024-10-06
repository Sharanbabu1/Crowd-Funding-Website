document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const fundraiserId = params.get('id');
    const donationForm = document.getElementById('donationForm');

    // Fetch fundraiser details to show on the donation page
    function fetchFundraiserDetails() {
        fetch(`/api/fundraiser/${fundraiserId}`)
            .then(response => response.json())
            .then(fundraiser => {
                document.getElementById('fundraiserTitle').textContent = fundraiser.CAPTION;
            })
            .catch(error => console.error('Error fetching fundraiser details:', error));
    }

    donationForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const giver = document.getElementById('giver').value;
        const amount = parseFloat(document.getElementById('amount').value);

        if (amount < 5) {
            alert('The minimum donation is 5 AUD');
            return;
        }

        // Submit the donation
        fetch('/donations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ giver, amount, fundraiserId })
        })
            .then(response => {
                if (!response.ok) throw new Error('Donation failed');
                return response.json();
            })
            .then(data => {
                alert(`Thank you for your donation to ${data.fundraiserTitle}`);
                window.location.href = `/fundraiser?id=${fundraiserId}`; // Redirect back to the fundraiser page
            })
            .catch(error => console.error('Error submitting donation:', error));
    });

    fetchFundraiserDetails();
});
