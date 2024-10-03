const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

// MySQL connection setup
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Madhumayaadhikari12', //  MySQL password
    database: 'crowdfunding_db'       //  database name
});

// Connect to MySQL and handle connection errors
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

// Serve static files from the 'public' directory
app.use(express.static('public'));
app.use(express.json());

// Serve home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Serve search page
app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

// Serve fundraiser details page
app.get('/fundraiser/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'fundraiser.html'));
});

// Fetch all fundraisers (this includes both active and inactive)
app.get('/api/fundraisers', (req, res) => {
    const sql = 'SELECT * FROM FUNDRAISER';
    connection.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching fundraisers' });
            return;
        }
        res.json(results);
    });
});

// NEW: Fetch only active fundraisers (ACTIVE = 1)
app.get('/api/fundraisers/active', (req, res) => {
    const sql = 'SELECT * FROM FUNDRAISER WHERE ACTIVE = 1'; // Fetch only active fundraisers
    connection.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching active fundraisers' });
            return;
        }
        res.json(results); // Send the active fundraisers to the frontend
    });
});

// Fetch fundraiser details by ID
app.get('/api/fundraisers/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const sql = 'SELECT * FROM FUNDRAISER WHERE FUNDRAISER_ID = ?';

    connection.query(sql, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching fundraiser details' });
            return;
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'Fundraiser not found' });
        }
    });
});

// Add a new fundraiser
app.post('/api/fundraisers', (req, res) => {
    const { title, goal } = req.body;
    const sql = 'INSERT INTO FUNDRAISER (TITLE, GOAL, ACTIVE) VALUES (?, ?, 1)'; // New fundraiser is always active (ACTIVE = 1)

    connection.query(sql, [title, goal], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error adding fundraiser' });
            return;
        }
        res.status(201).json({ id: results.insertId, title, goal, status: 'Active' });
    });
});

// Update an existing fundraiser
app.put('/api/fundraisers/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, goal } = req.body;
    const sql = 'UPDATE FUNDRAISER SET TITLE = ?, GOAL = ? WHERE FUNDRAISER_ID = ?';

    connection.query(sql, [title, goal, id], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error updating fundraiser' });
            return;
        }
        res.json({ id, title, goal, status: 'Updated' });
    });
});

// Delete a fundraiser
app.delete('/api/fundraisers/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const sql = 'DELETE FROM FUNDRAISER WHERE FUNDRAISER_ID = ?';

    connection.query(sql, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error deleting fundraiser' });
            return;
        }
        if (results.affectedRows > 0) {
            res.json({ message: 'Fundraiser deleted successfully!' });
        } else {
            res.status(404).json({ message: 'Fundraiser not found' });
        }
    });
});

// Search fundraisers based on query parameters
app.get('/search-fundraisers', (req, res) => {
    const { organizer, city, category } = req.query;
    let sql = 'SELECT * FROM FUNDRAISER WHERE ACTIVE = 1'; // Always search only active fundraisers
    const queryParams = [];

    if (category) {
        sql += ' AND CATEGORY_ID = ?';
        queryParams.push(category);
    }
    if (city) {
        sql += ' AND CITY = ?';
        queryParams.push(city);
    }
    if (organizer) {
        sql += ' AND ORGANIZER = ?';
        queryParams.push(organizer);
    }

    connection.query(sql, queryParams, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error searching fundraisers' });
            return;
        }
        res.json(results);
    });
});
// donations data
const donations = [
    { id: 1, date: '2024-09-01 10:00:00', amount: 50.00, giver: 'John Doe', fundraiserId: 1 },
    { id: 2, date: '2024-09-02 12:30:00', amount: 75.00, giver: 'Jane Smith', fundraiserId: 2 },
    { id: 3, date: '2024-09-03 14:45:00', amount: 100.00, giver: 'Alice Johnson', fundraiserId: 1 },
    { id: 4, date: '2024-09-04 11:20:00', amount: 150.00, giver: 'Bob Brown', fundraiserId: 3 },
    { id: 5, date: '2024-09-05 09:15:00', amount: 200.00, giver: 'Charlie Black', fundraiserId: 4 },
    { id: 6, date: '2024-09-06 08:00:00', amount: 80.00, giver: 'David White', fundraiserId: 5 },
];
// Endpoint to fetch donations
app.get('/api/donations', (req, res) => {
    res.json(donations);
});

// Serve the fundraiser HTML page
app.get('/fundraiser/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'fundraiser.html'));
});

// API route to get fundraiser details by ID
app.get('/api/fundraiser/:id', (req, res) => {
    const fundraiser = fundraisers.find(f => f.id === req.params.id);
    if (fundraiser) {
        res.json(fundraiser);
    } else {
        res.status(404).send('Fundraiser not found');
    }
});

// API route to get donations for a specific fundraiser
app.get('/api/donations/:fundraiserId', (req, res) => {
    const fundraiserDonations = donations[req.params.fundraiserId];
    if (fundraiserDonations) {
        res.json(fundraiserDonations);
    } else {
        res.status(404).send('No donations found for this fundraiser');
    }
});

// Start the server and listen on port 3000
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
