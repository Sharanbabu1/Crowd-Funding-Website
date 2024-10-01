// crowdfunding_db.js

const mysql = require('mysql2'); // Importing the MySQL module to interact with the database

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',                // Host where MySQL database is running
    user: 'root',                     // MySQL username; default is 'root'
    password: 'Madhumayaadhikari12',  // MySQL password
    database: 'crowdfunding_db'       // The name of the database
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('MySQL Connected...');
});

// Function to create tables if they do not exist
const createTables = () => {
    // SQL statement to create the CATEGORY table
    const createCategoryTable = `
        CREATE TABLE IF NOT EXISTS CATEGORY (
            CATEGORY_ID INT AUTO_INCREMENT PRIMARY KEY,
            NAME VARCHAR(100) NOT NULL UNIQUE
        );
    `;

    // SQL statement to create the FUNDRAISER table
    const createFundraiserTable = `
        CREATE TABLE IF NOT EXISTS FUNDRAISER (
            FUNDRAISER_ID INT AUTO_INCREMENT PRIMARY KEY,
            CAPTION VARCHAR(255) NOT NULL,
            ORGANIZER VARCHAR(255) NOT NULL,
            CITY VARCHAR(100) NOT NULL,
            CURRENT_FUNDING DECIMAL(10, 2) DEFAULT 0,
            ACTIVE BOOLEAN DEFAULT true,
            CATEGORY_ID INT,
            FOREIGN KEY (CATEGORY_ID) REFERENCES CATEGORY(CATEGORY_ID)
        );
    `;

    // SQL statement to create the DONATION table
    const createDonationTable = `
        CREATE TABLE IF NOT EXISTS DONATION (
            DONATION_ID INT AUTO_INCREMENT PRIMARY KEY,
            DATE DATE NOT NULL,
            AMOUNT DECIMAL(10, 2) NOT NULL,
            GIVER VARCHAR(255) NOT NULL,
            FUNDRAISER_ID INT,
            FOREIGN KEY (FUNDRAISER_ID) REFERENCES FUNDRAISER(FUNDRAISER_ID)
        );
    `;

    // Execute the table creation queries
    connection.query(createCategoryTable, (err) => {
        if (err) throw err;
        console.log('Category table created or already exists.');
    });

    connection.query(createFundraiserTable, (err) => {
        if (err) throw err;
        console.log('Fundraiser table created or already exists.');
    });

    connection.query(createDonationTable, (err) => {
        if (err) throw err;
        console.log('Donation table created or already exists.');
    });
};

// Call the function to create the tables
createTables();

// Export the connection for use in other files
module.exports = connection;
