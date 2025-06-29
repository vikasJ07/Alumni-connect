const { pool } = require("../db");

const createAdditionalInfoTable = async () => {
    const additionalInfoQuery = `
        CREATE TABLE IF NOT EXISTS addi_stud_info (
            id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
            user_id CHAR(36) NOT NULL,
            about TEXT,
            hobbies TEXT,
            skills TEXT,
            interested_fields TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `;

    try {
        await pool.execute(additionalInfoQuery);
        console.log("Additional Info table created successfully.");
    } catch (err) {
        console.error("Error creating additional info table:", err.message);
    } finally {
        pool.end();
    }
};

createAdditionalInfoTable();
