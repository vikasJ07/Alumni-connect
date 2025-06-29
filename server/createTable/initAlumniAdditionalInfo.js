const { pool } = require("../db");

const createAdditionalInfoTable = async () => {
    const AdditionalInfoQuery = `
        CREATE TABLE IF NOT EXISTS additional_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
            alumni_id CHAR(36) NOT NULL,
    hobbies TEXT,
    about TEXT
);`;

    try {
        await pool.query(AdditionalInfoQuery);
        console.log("Friends table created successfully.");
    } catch (err) {
        console.error("Error creating friends table:", err.message);
    }
};

createAdditionalInfoTable();



