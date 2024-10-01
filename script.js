document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.querySelector('#search-form');
    const fundraiserList = document.querySelector('#fundraiser-list');

    function showLoadingIndicator() {
        fundraiserList.innerHTML = '<p>Loading...</p>';
    }

    function hideLoadingIndicator() {
        fundraiserList.innerHTML = ''; 
    }

    function createFundraiserCard(fundraiser) {
        const card = document.createElement('div');
        card.className = 'fundraiser-card';
        card.innerHTML = `
            <img src="/images/${fundraiser.image}" alt="Fundraiser Image">
            <h3>${fundraiser.title}</h3>
            <p>Goal: $${fundraiser.goal} | Raised: $${fundraiser.raised}</p>
            <a href="/fundraiser.html?id=${fundraiser.id}">Learn More</a>
        `;
        return card;
    }

    function fetchFundraisers() {
        showLoadingIndicator();
        fetch('/fundraisers')
            .then(response => response.json())
            .then(data => {
                hideLoadingIndicator();
                fundraiserList.innerHTML = ''; 
                data.forEach(fundraiser => {
                    fundraiserList.appendChild(createFundraiserCard(fundraiser));
                });
            })
            .catch(error => {
                console.error('Error:', error);
                fundraiserList.innerHTML = '<p>Error loading fundraisers. Please try again later.</p>';
            });
    }

    fetchFundraisers(); // Initial load of fundraisers

    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const query = document.querySelector('#search-query').value;
            showLoadingIndicator();
            fetch(`/search?query=${query}`)
                .then(response => response.json())
                .then(data => {
                    hideLoadingIndicator();
                    fundraiserList.innerHTML = ''; 
                    data.forEach(fundraiser => {
                        fundraiserList.appendChild(createFundraiserCard(fundraiser));
                    });
                })
                .catch(error => {
                    console.error('Error:', error);
                    fundraiserList.innerHTML = '<p>Error loading fundraisers. Please try again later.</p>';
                });
        });
    }
});
