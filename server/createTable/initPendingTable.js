const { pool } = require('../db');

// Initialize the PendingAlumni table
const initPendingTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS PendingAlumni (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            graduationYear INT NOT NULL,
            documentPath VARCHAR(255) NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await pool.query(query);
        console.log('PendingAlumni table initialized successfully.');
    } catch (err) {
        console.error('Error creating PendingAlumni table:', err);
    }
};

initPendingTable();
