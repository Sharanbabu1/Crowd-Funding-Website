const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Dinanath#001',
    database: 'crowdfunding_db'
});

connection.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

// Serve pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'home.html')));
app.get('/search', (req, res) => res.sendFile(path.join(__dirname, 'public', 'search.html')));
app.get('/fundraisers', (req, res) => res.sendFile(path.join(__dirname, 'public', 'fundraisers.html')));
app.get('/fundraiser', (req, res) => res.sendFile(path.join(__dirname, 'public', 'fundraiser.html')));
app.get('/donation', (req, res) => res.sendFile(path.join(__dirname, 'public', 'donation.html')));

// Fetch active fundraisers
app.get('/api/fundraisers/active', (req, res) => {
    const sql = 'SELECT * FROM FUNDRAISER WHERE ACTIVE = 1';
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error fetching fundraisers' });
        res.json(results);
    });
});

// Fetch fundraiser details
app.get('/api/fundraiser/:id', (req, res) => {
    const fundraiserId = req.params.id;
    const sql = 'SELECT CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ORGANIZER FROM FUNDRAISER WHERE FUNDRAISER_ID = ?';
    connection.query(sql, [fundraiserId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error fetching fundraiser details' });
        if (results.length > 0) res.json(results[0]);
        else res.status(404).json({ message: 'Fundraiser not found' });
    });
});

// Fetch donations for a fundraiser
app.get('/api/fundraiser/:id/donations', (req, res) => {
    const fundraiserId = req.params.id;
    const sql = 'SELECT * FROM DONATION WHERE FUNDRAISER_ID = ?';
    connection.query(sql, [fundraiserId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error fetching donations' });
        res.json(results);
    });
});

// Add a new donation
app.post('/donations', (req, res) => {
    const { giver, amount, fundraiserId } = req.body;
    const query = 'INSERT INTO DONATION (DATE, AMOUNT, GIVER, FUNDRAISER_ID) VALUES (NOW(), ?, ?, ?)';
    connection.query(query, [amount, giver, fundraiserId], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error adding donation' });
        res.json({ message: 'Donation added successfully' });
    });
});

// 404 Error Handling
app.use((req, res) => res.status(404).send('404 - Not Found'));

// Start server
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
