const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

// Database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password', // replace with your actual password
    database: 'crowdfunding_db'
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

// Middleware
app.use(express.static('public'));
app.use(express.json());

// API endpoints
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

// Add a new fundraiser
app.post('/api/fundraisers', (req, res) => {
    const { title, goal } = req.body;
    const sql = 'INSERT INTO FUNDRAISER (TITLE, GOAL) VALUES (?, ?)';
    connection.query(sql, [title, goal], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error adding fundraiser' });
            return;
        }
        res.status(201).json({ id: results.insertId, title, goal });
    });
});

// Update a fundraiser
app.put('/api/fundraisers/:id', (req, res) => {
    const id = req.params.id;
    const { title, goal } = req.body;
    const sql = 'UPDATE FUNDRAISER SET TITLE = ?, GOAL = ? WHERE FUNDRAISER_ID = ?';
    connection.query(sql, [title, goal, id], (err) => {
        if (err) {
            res.status(500).json({ error: 'Error updating fundraiser' });
            return;
        }
        res.json({ message: 'Fundraiser updated successfully' });
    });
});

// Delete a fundraiser
app.delete('/api/fundraisers/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM FUNDRAISER WHERE FUNDRAISER_ID = ?';
    connection.query(sql, [id], (err) => {
        if (err) {
            res.status(500).json({ error: 'Error deleting fundraiser' });
            return;
        }
        res.json({ message: 'Fundraiser deleted successfully' });
    });
});

// Serve the admin page
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
