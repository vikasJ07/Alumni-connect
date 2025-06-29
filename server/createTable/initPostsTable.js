const { pool } = require("../db");

const createPostsTable = async () => {
    const postsTableQuery = `
        CREATE TABLE IF NOT EXISTS posts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            alumni_id CHAR(36) NOT NULL,
            post JSON, 
            description TEXT,           
            likes_count INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Automatically set the creation time
            FOREIGN KEY (alumni_id) REFERENCES Alumni(id) ON DELETE CASCADE -- Ensures referential integrity
        );
    `;
    //TEXT is designed for variable-length strings. It allocates only the necessary amount of space for the data stored.
    try {
        await pool.execute(postsTableQuery);
        console.log("Posts table created successfully.");
    } catch (err) {
        console.error("Error creating posts table:", err.message);
    }
};

createPostsTable();
