const bcrypt = require('bcrypt');
const { pool } = require('../db'); // Replace with your DB connection file

const initAdminDatabase = async () => {
    try {
        const email = 'admin@gmail.com';
        const password = 'Admin@123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            CREATE TABLE IF NOT EXISTS admin (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            );
        `;
        await pool.execute(query);

        const insertQuery = `
            INSERT IGNORE INTO admin (email, password) VALUES (?, ?);
        `;
        await pool.execute(insertQuery, [email, hashedPassword]);

        console.log('Admin database initialized successfully');
    } catch (error) {
        console.error('Error initializing admin database:', error);
    }
};

initAdminDatabase();
