// Import required libraries
const express = require('express');
const mysql = require('mysql2');
const path = require('path'); // For serving HTML files
const cors = require('cors'); // Import CORS

// Initialize the Express application
const app = express();
const port = process.env.PORT || 3000; // Use environment port or default to 3000

// Enable CORS for all routes
app.use(cors()); // Allow all origins
app.use(express.static('public'));
app.use(express.json()); // Parse JSON request bodies

// Create MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Madhumayaadhikari12',
    database: 'crowdfunding_db'
});

// Connecting to MySQL
connection.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Creating the GET API for active fundraisers
app.get('/api/fundraisers/active', (req, res) => {
    let sql = `
        SELECT FUNDRAISER.*, CATEGORY.NAME 
        FROM FUNDRAISER 
        JOIN CATEGORY ON FUNDRAISER.CATEGORY_ID = CATEGORY.CATEGORY_ID 
        WHERE FUNDRAISER.ACTIVE = 1;
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching active fundraisers:', err); // Log error details
            return res.status(500).json({ error: 'Error fetching fundraisers' });
        }
        res.json(results);
    });
});

// Route for searching fundraisers
app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'search.html')); // Serve the search.html file
});

// Route to handle search requests
app.get('/api/search', (req, res) => {
    const { organizer, city, category } = req.query; // Destructure query parameters from the request

    let sql = `
        SELECT FUNDRAISER.*, CATEGORY.NAME AS CATEGORY_NAME 
        FROM FUNDRAISER 
        JOIN CATEGORY ON FUNDRAISER.CATEGORY_ID = CATEGORY.CATEGORY_ID 
        WHERE FUNDRAISER.ACTIVE = 1
    `;
    
    const conditions = [];
    const params = [];

    if (organizer) {
        conditions.push('FUNDRAISER.ORGANIZER LIKE ?');
        params.push(`%${organizer}%`);
    }
    if (city) {
        conditions.push('FUNDRAISER.CITY LIKE ?');
        params.push(`%${city}%`);
    }
    if (category) {
        conditions.push('FUNDRAISER.CATEGORY_ID = ?');
        params.push(category);
    }

    if (conditions.length > 0) {
        sql += ' AND ' + conditions.join(' AND ');
    }

    console.log('Final SQL Query:', sql); // Log the SQL query
    console.log('Parameters:', params); // Log the parameters

    connection.query(sql, params, (err, results) => {
        if (err) {
            console.error('Database Query Error:', err); // Log the error
            return res.status(500).json({ error: 'Error fetching fundraisers' });
        }
    
        res.json(results);
    });
});



// Get all fundraisers
app.get('/fundraisers', (req, res) => {
    res.json(fundraisers);
});

// Get fundraiser by ID
app.get('/fundraiser/:id', (req, res) => {
    const fundraiser = fundraisers.find(f => f.id === req.params.id);
    if (fundraiser) {
        res.json(fundraiser);
    } else {
        res.status(404).send('Fundraiser not found');
    }
});


// Route for individual fundraiser details
app.get('/fundraiser/:id', (req, res) => {
    const fundraiserId = req.params.id;
    const sql = `
        SELECT FUNDRAISER.*, 
               CATEGORY.NAME AS CATEGORY_NAME, 
               (SELECT JSON_ARRAYAGG(DONATION) FROM DONATION WHERE FUNDRAISER_ID = ?) AS DONATIONS
        FROM FUNDRAISER 
        JOIN CATEGORY ON FUNDRAISER.CATEGORY_ID = CATEGORY.CATEGORY_ID 
        WHERE FUNDRAISER.FUNDRAISER_ID = ?;
    `;

    connection.query(sql, [fundraiserId, fundraiserId], (err, results) => {
        if (err) {
            console.error('Error fetching fundraiser details:', err); // Log error details
            return res.status(500).send('Internal Server Error');
        }
        if (results.length > 0) {
            const fundraiser = results[0];
            res.json(fundraiser);
        } else {
            res.status(404).send('Fundraiser not found');
        }
    });
});

// Donation Routes

// 1. Add a new donation
app.post('/donations', (req, res) => {
    const { date, amount, giver, fundraiserId } = req.body; // Destructuring the donation details from the request body
    const query = 'INSERT INTO donation (DATE, AMOUNT, GIVER, FUNDRAISER_ID) VALUES (?, ?, ?, ?)';
    
    connection.query(query, [date, amount, giver, fundraiserId], (err, results) => {
        if (err) {
            console.error('Error adding donation:', err); // Log error details
            return res.status(500).json({ error: err.message }); // Respond with error if the query fails
        }
        res.status(201).json({ message: 'Donation added', donationId: results.insertId }); // Respond with success and donation ID
    });
});

// 2. Get all donations
app.get('/donations', (req, res) => {
    const query = 'SELECT * FROM donation'; // SQL query to select all donations
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching donations:', err); // Log error details
            return res.status(500).json({ error: err.message }); // Respond with error if the query fails
        }
        res.json(results); // Respond with the retrieved donations
    });
});

// 3. Get donations by fundraiser ID
app.get('/donations/fundraiser/:id', (req, res) => {
    const fundraiserId = req.params.id; // Extracting fundraiser ID from the request parameters
    const query = 'SELECT * FROM donation WHERE FUNDRAISER_ID = ?';
    
    connection.query(query, [fundraiserId], (err, results) => {
        if (err) {
            console.error('Error fetching donations for fundraiser:', err); // Log error details
            return res.status(500).json({ error: err.message }); // Respond with error if the query fails
        }
        res.json(results); // Respond with the retrieved donations for the specific fundraiser
    });
});

// 4. Update an existing fundraiser by ID
app.put('/fundraisers/:id', (req, res) => {
    const fundraiserId = req.params.id; // Extracting fundraiser ID from the request parameters
    const { caption, organizer, city, categoryId, active } = req.body; // Destructuring updated fundraiser details
    const query = `
        UPDATE FUNDRAISER 
        SET CAPTION = ?, ORGANIZER = ?, CITY = ?, CATEGORY_ID = ?, ACTIVE = ? 
        WHERE FUNDRAISER_ID = ?
    `;
    
    connection.query(query, [caption, organizer, city, categoryId, active, fundraiserId], (err) => {
        if (err) {
            console.error('Error updating fundraiser:', err); // Log error details
            return res.status(500).json({ error: err.message }); // Respond with error if the query fails
        }
        res.json({ message: 'Fundraiser updated' }); // Respond with success message
    });
});

// 5. Delete an existing fundraiser by ID
app.delete('/fundraisers/:id', (req, res) => {
    const fundraiserId = req.params.id; // Extracting fundraiser ID from the request parameters
    const checkQuery = 'SELECT COUNT(*) AS donationCount FROM donation WHERE FUNDRAISER_ID = ?';

    connection.query(checkQuery, [fundraiserId], (err, results) => {
        if (err) {
            console.error('Error checking donations for fundraiser:', err); // Log error details
            return res.status(500).json({ error: err.message }); // Respond with error if the query fails
        }
        const donationCount = results[0].donationCount;

        if (donationCount > 0) {
            return res.status(400).json({ error: 'Cannot delete fundraiser with existing donations' });
        }

        const deleteQuery = 'DELETE FROM FUNDRAISER WHERE FUNDRAISER_ID = ?';
        connection.query(deleteQuery, [fundraiserId], (err) => {
            if (err) {
                console.error('Error deleting fundraiser:', err); // Log error details
                return res.status(500).json({ error: err.message }); // Respond with error if the query fails
            }
            res.json({ message: 'Fundraiser deleted' }); // Respond with success message
        });
    });
});
