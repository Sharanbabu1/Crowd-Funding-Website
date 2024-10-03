const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000; // Ensure this port is not being used by another application

// Database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Madhumayaadhikari12', 
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
app.use(cors()); // Enable CORS
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory
app.use(express.json());

// Serve the admin page
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html')); // Correct path to admin.html
});

// Fetch all fundraisers
app.get('/api/fundraisers', (req, res) => {
    const sql = 'SELECT `FUNDRAISER_ID`, `ORGANIZER`, `CAPTION`, `TARGET_FUNDING`, `CURRENT_FUNDING` FROM `FUNDRAISER`';
    connection.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching fundraisers' });
            return;
        }
        res.json(results);
    });
});

// Add new fundraiser
app.post('/api/fundraisers', (req, res) => {
    const { organizer, caption, targetFunding, currentFunding } = req.body;
    const sql = 'INSERT INTO `FUNDRAISER` (`ORGANIZER`, `CAPTION`, `TARGET_FUNDING`, `CURRENT_FUNDING`) VALUES (?, ?, ?, ?)';
    connection.query(sql, [organizer, caption, targetFunding, currentFunding], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error adding fundraiser' });
            return;
        }
        res.status(201).json({ id: result.insertId }); // Return the ID of the new fundraiser
    });
});

// Update fundraiser
app.put('/api/fundraisers/:id', (req, res) => {
    const { id } = req.params;
    const { organizer, caption, targetFunding, currentFunding } = req.body;
    const sql = 'UPDATE `FUNDRAISER` SET `ORGANIZER` = ?, `CAPTION` = ?, `TARGET_FUNDING` = ?, `CURRENT_FUNDING` = ? WHERE `FUNDRAISER_ID` = ?';
    connection.query(sql, [organizer, caption, targetFunding, currentFunding, id], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error updating fundraiser' });
            return;
        }
        res.json({ message: 'Fundraiser updated successfully' });
    });
});

// Delete fundraiser
app.delete('/api/fundraisers/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM `FUNDRAISER` WHERE `FUNDRAISER_ID` = ?';
    connection.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error deleting fundraiser' });
            return;
        }
        res.json({ message: 'Fundraiser deleted successfully' });
    });
});

// Handle root path
app.get('/', (req, res) => {
    res.send('Welcome to the API!'); // Optional message for root path
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
