const { pool } = require("../db");

const User = {
    // Insert a new user into the database
    create: async (username, password, email, department, admissionYear, profilePhoto) => {
        const query = `
            INSERT INTO users (username, password, email, department, admission_year, profile_photo)
            VALUES (?, ?, ?, ?, ?, ?);
        `;
        const values = [username, password, email, department, admissionYear, profilePhoto];
        const [result] = await pool.execute(query, values);
        return result; // Returns the query result (e.g., insertId, affectedRows, etc.)
    },

    // Find a user by username
    findByUsername: async (username) => {
        const query = `
            SELECT * FROM users WHERE username = ?;
        `;
        const [rows] = await pool.execute(query, [username]);
        return rows[0]; // Return the first result (or undefined if not found)
    },

    // Find a user by email
    findByEmail: async (email) => {
        const query = `
            SELECT * FROM users WHERE email = ?;
        `;
        const [rows] = await pool.execute(query, [email]);
        return rows[0]; // Return the first result (or undefined if not found)
    },

    // Find a user by ID
findById: async (id) => {
    const query = `
        SELECT * FROM users WHERE id = ?;
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0]; // Return the first result (or undefined if not found)
},

    // Get all users (example function)
    findAll: async () => {
        const query = `
            SELECT * FROM users;
        `;
        const [rows] = await pool.execute(query);
        return rows; // Return all rows
    },

    update: async (id, updates) => {
        const { email, department, admission_year, profilePhotoUrl } = updates;

        const query = `UPDATE Users SET email = ?, department = ?, admission_year = ?,  profile_photo = ? WHERE id = ?;`;
        const values = [email || null,department || null, admission_year || null,  profilePhotoUrl || null, id];
        const [result] = await pool.query(query, values);
        return result;
    },
};

module.exports = User;
