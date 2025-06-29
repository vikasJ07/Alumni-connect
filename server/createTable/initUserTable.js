const { pool } = require("../db");

const createUsersTable = async () => {
    const usersTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
            username VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            department VARCHAR(50),
            admission_year INT,
            profile_photo VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await pool.execute(usersTableQuery);
        console.log("Users table created successfully.");
    } catch (err) {
        console.error("Error creating users table:", err.message);
    } finally {
        pool.end(); // Close the connection pool
    }
};

createUsersTable();
