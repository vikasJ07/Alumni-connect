const { pool } = require("../db");

const createFriendsTable = async () => {
    const friendsTableQuery = `
        CREATE TABLE IF NOT EXISTS friends (
    alumni_id CHAR(36) NOT NULL,             
    friend_id CHAR(36) NOT NULL,             
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (alumni_id, friend_id)
);
    `;

    try {
        await pool.execute(friendsTableQuery);
        console.log("Friends table created successfully.");
    } catch (err) {
        console.error("Error creating friends table:", err); // Log full error for debugging
    }
};

createFriendsTable();
