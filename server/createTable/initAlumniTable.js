const { pool } = require('../db');

const initAlumniTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS Alumni (
            id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            company_name VARCHAR(255) NOT NULL,
            company_location VARCHAR(255) NOT NULL,
            address VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            graduationYear INT NOT NULL,
            documentPath VARCHAR(255) NOT NULL,
            profile_photo VARCHAR(255),
            isPending BOOLEAN NOT NULL DEFAULT FALSE,
            isRejected BOOLEAN NOT NULL DEFAULT FALSE
        );
    `;

    try {
        const [results] = await pool.query(query);
        console.log('Alumni table initialized successfully.');
    } catch (err) {
        console.error('Error creating Alumni table:', err);
    }
};

initAlumniTable();
