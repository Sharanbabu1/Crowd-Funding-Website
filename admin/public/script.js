document.addEventListener('DOMContentLoaded', () => {
    const fundraiserTableBody = document.querySelector('#fundraiserTable tbody');
    const addFundraiserForm = document.getElementById('addFundraiserForm');
    const updateFundraiserForm = document.getElementById('updateFundraiserForm');

    // Function to fetch and display fundraisers
    const fetchFundraisers = async () => {
        try {
            const response = await fetch('/api/fundraisers');
            const fundraisers = await response.json();
            fundraiserTableBody.innerHTML = ''; // Clear existing entries
            fundraisers.forEach(fundraiser => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${fundraiser.FUNDRAISER_ID}</td>
                    <td>${fundraiser.ORGANIZER}</td>
                    <td>${fundraiser.CAPTION}</td>
                    <td>${fundraiser.TARGET_FUNDING}</td>
                    <td>${fundraiser.CURRENT_FUNDING}</td>
                    <td>
                        <button onclick="deleteFundraiser(${fundraiser.FUNDRAISER_ID})">Delete</button>
                    </td>
                `;
                fundraiserTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching fundraisers:', error);
        }
    };

    // Add new fundraiser
    addFundraiserForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const organizer = document.getElementById('organizer').value;
        const caption = document.getElementById('caption').value;
        const targetFunding = document.getElementById('targetFunding').value;
        const currentFunding = document.getElementById('currentFunding').value;

        try {
            const response = await fetch('/api/fundraisers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ organizer, caption, targetFunding, currentFunding })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            document.getElementById('addMessage').textContent = `Fundraiser added with ID: ${data.id}`;
            fetchFundraisers(); // Refresh the list
        } catch (error) {
            console.error('Error adding fundraiser:', error);
        }
    });

    // Update fundraiser
    updateFundraiserForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = document.getElementById('updateId').value;
        const organizer = document.getElementById('updateOrganizer').value;
        const caption = document.getElementById('updateCaption').value;
        const targetFunding = document.getElementById('updateTargetFunding').value;
        const currentFunding = document.getElementById('updateCurrentFunding').value;

        try {
            const response = await fetch(`/api/fundraisers/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ organizer, caption, targetFunding, currentFunding })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            document.getElementById('updateMessage').textContent = data.message;
            fetchFundraisers(); // Refresh the list
        } catch (error) {
            console.error('Error updating fundraiser:', error);
        }
    });

    // Delete fundraiser
    window.deleteFundraiser = async (id) => {
        try {
            await fetch(`/api/fundraisers/${id}`, {
                method: 'DELETE'
            });
            fetchFundraisers(); // Refresh the list
        } catch (error) {
            console.error('Error deleting fundraiser:', error);
        }
    };

    // Initial fetch
    fetchFundraisers();
});
