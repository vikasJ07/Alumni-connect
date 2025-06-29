const { pool } = require('../db');

const AlumniModel = {
    // Create a new alumni record
    createAlumni: async (data) => {
        const { username, password, name, email, graduationYear, companyName, companyLocation, address, documentUrl, profilePhotoUrl} = data;
        const query = `
            INSERT INTO Alumni (username, password, name, email, graduationYear, company_name, company_location, address,documentPath, profile_photo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        return pool.query(query, [username, password, name, email, graduationYear, companyName, companyLocation, address, documentUrl, profilePhotoUrl]);
    },

    // Find an alumni by username
    findAlumniByUsername: async (username) => {
        const query = `SELECT * FROM Alumni WHERE username = ?;`;
        const [rows] = await pool.query(query, [username]);
        return rows[0]; // Return a single alumni object or undefined
    },

    // Find an alumni by email
    findAlumniByEmail: async (email) => {
        const query = `SELECT * FROM Alumni WHERE email = ?;`;
        const [rows] = await pool.query(query, [email]);
        return rows[0]; // Return a single alumni object or undefined
    },

    // Find an alumni by ID
    findById: async (id) => {
        const query = `
            SELECT * FROM Alumni WHERE id = ?;
        `;
        const [rows] = await pool.execute(query, [id]);
        return rows[0]; // Return the first result (or undefined if not found)
    },

    // Find all pending alumni requests
    findPendingRequests: async () => {
        const query = `SELECT * FROM Alumni WHERE isPending = 1;`;
        const [rows] = await pool.query(query);
        return rows; // Return an array of pending alumni
    },

    updatePendingStatus: async (id, isPending) => {
        const query = `UPDATE Alumni SET isPending = ? WHERE id = ?;`;
        const [result] = await pool.query(query, [isPending, id]);
        return result; // Contains metadata about the update operation
    },

    updateRejectedStatus: async (id, isRejected) => {
        const query = `UPDATE Alumni SET isRejected = ? WHERE id = ?;`;
        const [result] = await pool.query(query, [isRejected, id]);
        return result; // Contains metadata about the update operation
    },
    // Remove an alumni by username
    removeAlumniByUsername: async (username) => {
        const query = `DELETE FROM Alumni WHERE username = ?;`;
        await pool.query(query, [username]);
    },

    // Update alumni details
    update: async (id, updates) => {
        const { name, email, graduationYear, companyName, companyLocation, address, profilePhotoUrl } = updates;

        const query = `UPDATE Alumni SET name = ?, email = ?, graduationYear = ?, company_name = ?, company_location = ?, address = ?, profile_photo = ? WHERE id = ?;`;
        const values = [name || null, email || null, graduationYear || null, companyName || null, companyLocation || null, address || null, profilePhotoUrl || null, id];
        const [result] = await pool.query(query, values);
        return result;
    },

    //Get Three Random Alumni
    getRandomAlumni: async (id) => {
        const query = `
            SELECT * 
            FROM Alumni 
            WHERE id != ?  -- Exclude the requesting alumni
            AND id NOT IN (
                SELECT friend_id 
                FROM Friends 
                WHERE alumni_id = ?
                UNION
                SELECT alumni_id 
                FROM Friends 
                WHERE friend_id = ?
            )
            ORDER BY RAND()  -- Randomly select
            LIMIT 3;  -- Limit to 3 alumni
        `;
    
        try {
            const [rows] = await pool.query(query, [
                id, // First ? (Exclude the requesting alumni)
                id, // Second ? (Friends list where alumni_id matches)
                id  // Third ? (Friends list where friend_id matches)
            ]);
            return rows;
        } catch (error) {
            console.error("Error fetching random alumni:", error);
            throw new Error("Database query failed");
        }
    },

    //Fetch alumni details for search bar
    fetchAlumniDetails: async () => {
        const query = 'SELECT id, username, address, profile_photo FROM Alumni;';
        const [rows] = await pool.execute(query);
        return rows; // Returns only the specified columns
    },
    

};

module.exports = AlumniModel;
