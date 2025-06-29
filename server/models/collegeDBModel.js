const { pool } = require("../db");

const CollegeDb = {
    // Find a student by USN
    findByUSN: async (usn) => {
        if (!usn) {
            throw new Error("USN is required");
        }
        const query = "SELECT * FROM CollegeDB WHERE USN = ?;";
        const [rows] = await pool.execute(query, [usn]);
        return rows[0]; // Return the student record or undefined if not found
    },

    // Fetch all students
    fetchAllStudents: async () => {
        const query = "SELECT * FROM CollegeDB;";
        const [rows] = await pool.execute(query);
        return rows; // Returns all student records
    },
};

module.exports = CollegeDb;
