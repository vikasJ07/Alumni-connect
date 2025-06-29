const { pool } = require("../db"); // Replace with your DB connection file

const initCollegeDatabase = async () => {
    try {
        // Create the CollegeDB table if it doesn't exist
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS CollegeDB (
                id INT AUTO_INCREMENT PRIMARY KEY,
                USN VARCHAR(15) UNIQUE NOT NULL,
                Name VARCHAR(255) NOT NULL,
                GraduationYear INT NOT NULL
            );
        `;
        await pool.execute(createTableQuery);
        console.log("CollegeDB table created successfully");

        // Insert sample data
        const insertQuery = `
            INSERT IGNORE INTO CollegeDB (USN, Name, GraduationYear) VALUES 
            ('1RV22CS235', 'Vibha Ganesh Bhat', 2018),
            ('1RV22ME202', 'Priya Verma', 2024),
            ('1RV22EC303', 'Ankit Reddy', 2026);
        `;
        await pool.execute(insertQuery);

        console.log("Sample CollegeDB entries inserted successfully");
    } catch (error) {
        console.error("Error initializing CollegeDB:", error);
    }
};

// Run the initialization function
initCollegeDatabase();
