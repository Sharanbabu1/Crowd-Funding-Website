document.addEventListener('DOMContentLoaded', () => {
    fetchFundraisers();

    // Handle add fundraiser form submission
    document.getElementById('add-fundraiser-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const goal = document.getElementById('goal').value;

        const response = await fetch('/api/fundraisers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, goal })
        });

        if (response.ok) {
            fetchFundraisers();
            event.target.reset();
        } else {
            console.error('Error adding fundraiser');
        }
    });

    // Handle update fundraiser form submission
    document.getElementById('update-fundraiser-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = document.getElementById('update-id').value;
        const title = document.getElementById('update-title').value;
        const goal = document.getElementById('update-goal').value;

        const response = await fetch(`/api/fundraisers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, goal })
        });

        if (response.ok) {
            fetchFundraisers();
            event.target.reset();
        } else {
            console.error('Error updating fundraiser');
        }
    });
});

// Fetch fundraisers and display them
async function fetchFundraisers() {
    const response = await fetch('/api/fundraisers');
    const fundraisers = await response.json();
    const list = document.getElementById('fundraiser-list');
    list.innerHTML = '';

    fundraisers.forEach(fundraiser => {
        const item = document.createElement('div');
        item.className = 'fundraiser-item';
        item.innerHTML = `
            <h3>${fundraiser.TITLE}</h3>
            <p>Goal: $${fundraiser.GOAL}</p>
            <button onclick="deleteFundraiser(${fundraiser.FUNDRAISER_ID})">DELETE</button>
        `;
        list.appendChild(item);
    });
}

// Delete fundraiser function
async function deleteFundraiser(id) {
    const response = await fetch(`/api/fundraisers/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        fetchFundraisers();
    } else {
        console.error('Error deleting fundraiser');
    }
}
