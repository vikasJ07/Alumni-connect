const { pool } = require('../db');

const Pending = {
    // Add a new pending alumni record
    async createAlumni(alumni) {
        const query = `
            INSERT INTO PendingAlumni (username, password, name, email, graduationYear, documentPath)
            VALUES (?, ?, ?, ?, ?, ?);
        `;
        const values = [
            alumni.username,
            alumni.password,
            alumni.name,
            alumni.email,
            alumni.graduationYear,
            alumni.documentPath,
        ];

        try {
            const [result] = await pool.query(query, values);
            return result.insertId; // Return the ID of the new record
        } catch (err) {
            console.error('Error adding pending alumni:', err);
            throw err;
        }
    },

    // Find a pending alumni by username
    async findAlumniByUsername(username) {
        const query = `SELECT * FROM PendingAlumni WHERE username = ?;`;

        try {
            const [rows] = await pool.query(query, [username]);
            return rows[0]; // Return the first matching record
        } catch (err) {
            console.error('Error finding alumni by username:', err);
            throw err;
        }
    },

    // Find a pending alumni by email
    async findAlumniByEmail(email) {
        const query = `SELECT * FROM PendingAlumni WHERE email = ?;`;

        try {
            const [rows] = await pool.query(query, [email]);
            return rows[0]; // Return the first matching record
        } catch (err) {
            console.error('Error finding alumni by email:', err);
            throw err;
        }
    },

    // Find a pending alumni by ID
    async findAlumniById(id) {
        const query = `SELECT * FROM PendingAlumni WHERE id = ?;`;

        try {
            const [rows] = await pool.query(query, [id]);
            return rows[0]; // Return the first matching record
        } catch (err) {
            console.error('Error finding alumni by ID:', err);
            throw err;
        }
    },

    // Remove a pending alumni by ID (e.g., after approval)
    async removePendingAlumniById(id) {
        const query = `DELETE FROM PendingAlumni WHERE id = ?;`;

        try {
            const [result] = await pool.query(query, [id]);
            return result.affectedRows > 0; // Return true if a record was deleted
        } catch (err) {
            console.error('Error removing pending alumni by ID:', err);
            throw err;
        }
    },

    // Get all pending alumni records
    async getAllPendingAlumni() {
        const query = `SELECT * FROM PendingAlumni;`;

        try {
            const [rows] = await pool.query(query);
            return rows; // Return all records
        } catch (err) {
            console.error('Error retrieving all pending alumni:', err);
            throw err;
        }
    },
    findAll: async () => {
        const query = `
          SELECT * FROM PendingAlumni;
        `;
        try {
          const [rows] = await pool.query(query);
          return rows; // Return all rows from the PendingAlumni table
        } catch (error) {
          console.error('Error fetching pending alumni:', error);
          throw error;
        }
      },
};

module.exports = Pending;
