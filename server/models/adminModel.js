const { pool } = require('../db');

const Admin = {
    // Find admin by email
    findByEmail: async (email) => {
        const query = 'SELECT * FROM admin WHERE email = ?;';
        const [rows] = await pool.execute(query, [email]);
        return rows[0]; // Returns the admin record or undefined if not found
    },

    // Find admin by ID
    findById: async (id) => {
        if (id === undefined || id === null) {
            throw new Error('Invalid ID'); // Handle invalid ID
        }
        const query = 'SELECT * FROM admin WHERE id = ?;';
        const [rows] = await pool.execute(query, [id]);
        return rows[0]; // Return the first result (or undefined if not found)
    },

    // Fetch all alumni data
    fetchAllAlumni: async () => {
        const query = 'SELECT * FROM Alumni;';
        const [rows] = await pool.execute(query);
        return rows; // Returns all alumni records
    },
};

module.exports = Admin;
