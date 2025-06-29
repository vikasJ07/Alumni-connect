const { pool } = require("../db");

const createCommentsTable = async () => {
    const commentsTableQuery = `
        CREATE TABLE IF NOT EXISTS comments (
            id CHAR(36) PRIMARY KEY,
            post_id CHAR(36) NOT NULL,
            user_id CHAR(36) NOT NULL,
            user_type ENUM('User', 'Alumni') NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await pool.execute(commentsTableQuery);
        console.log("Comments table created successfully.");
    } catch (err) {
        console.error("Error creating comments table:", err);
    }
};

createCommentsTable()

