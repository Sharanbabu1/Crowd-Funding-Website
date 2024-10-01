const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Madhumayaadhikari12',
    database: 'crowdfunding_db'
});

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

// Fetch all fundraisers
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

// Fetch fundraiser details
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
    const sql = 'INSERT INTO FUNDRAISER (TITLE, GOAL, ACTIVE) VALUES (?, ?, 1)';

    connection.query(sql, [title, goal], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error adding fundraiser' });
            return;
        }
        res.status(201).json({ id: results.insertId, title, goal, status: 'Active' });
    });
});

// Update fundraiser
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

// Delete fundraiser
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
    let sql = 'SELECT * FROM FUNDRAISER WHERE ACTIVE = 1';
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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
