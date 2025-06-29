const { pool } = require("../db");

const AdditionalInfo = {
    // Retrieve additional info by alumni_id
    get: async (alumni_id) => {
        const query = `
            SELECT hobbies, about
            FROM additional_info
            WHERE alumni_id = ?;
        `;
        try {
            const [rows] = await pool.execute(query, [alumni_id]);
            return rows.length ? rows[0] : null; 
        } catch (error) {
            throw new Error("Error retrieving additional info: " + error.message);
        }
    },

    // Update or insert additional info for a given alumni_id
    update: async (alumni_id, data) => {
        const fields = [];
        const values = [];

        if (data.hobbies) {
            fields.push("hobbies = ?");
            values.push(data.hobbies);
        }
        if (data.about) {
            fields.push("about = ?");
            values.push(data.about);
        }

        if (fields.length === 0) {
            return false; // No updates to perform
        }

        // First, check if the alumni_id already exists in the additional_info table
        const checkQuery = `
            SELECT alumni_id FROM additional_info WHERE alumni_id = ?;
        `;
        
        try {
            const [rows] = await pool.execute(checkQuery, [alumni_id]);

            if (rows.length > 0) {
                // Alumni already exists, so update the existing record
                const updateQuery = `
                    UPDATE additional_info
                    SET ${fields.join(", ")}
                    WHERE alumni_id = ?;
                `;
                values.push(alumni_id);
                await pool.execute(updateQuery, values);
                return true; // Successfully updated
            } else {
                // Alumni does not exist, so insert a new record
                const insertQuery = `
                    INSERT INTO additional_info (alumni_id, ${fields.map(field => field.split(' ')[0]).join(', ')})
                    VALUES (?, ${fields.map(() => '?').join(', ')});
                `;
                values.unshift(alumni_id);
                await pool.execute(insertQuery, values);
                return true; // Successfully inserted
            }
        } catch (error) {
            throw new Error("Error updating additional info: " + error.message);
        }
    },
};

module.exports = AdditionalInfo;
