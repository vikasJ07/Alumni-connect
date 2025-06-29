const { pool } = require("../db");

const addStudentInfo = {
    // Retrieve student info by student_id
    get: async (student_id) => {
        const query = `
            SELECT about, hobbies, skills, interested_fields
            FROM addi_stud_info
            WHERE user_id = ?;
        `;
        try {
            const [rows] = await pool.execute(query, [student_id]);
            return rows.length ? rows[0] : null; 
        } catch (error) {
            throw new Error("Error retrieving student info: " + error.message);
        }
    },

    // Update or insert student info for a given student_id
    update: async (student_id, data) => {
        const fields = [];
        const values = [];

        if (data.about) {
            fields.push("about = ?");
            values.push(data.about);
        }
        if (data.hobbies) {
            fields.push("hobbies = ?");
            values.push(data.hobbies);
        }
        if (data.skills) {
            fields.push("skills = ?");
            values.push(data.skills);
        }
        if (data.interested_fields) {
            fields.push("interested_fields = ?");
            values.push(data.interested_fields);
        }

        if (fields.length === 0) {
            return false; // No updates to perform
        }

        // First, check if the student_id already exists in the student_info table
        const checkQuery = `
            SELECT user_id FROM addi_stud_info WHERE user_id = ?;
        `;
        
        try {
            const [rows] = await pool.execute(checkQuery, [student_id]);

            if (rows.length > 0) {
                // Student already exists, so update the existing record
                const updateQuery = `
                    UPDATE addi_stud_info
                    SET ${fields.join(", ")}
                    WHERE user_id = ?;
                `;
                values.push(student_id);
                await pool.execute(updateQuery, values);
                return true; // Successfully updated
            } else {
                // Student does not exist, so insert a new record
                const insertQuery = `
                    INSERT INTO addi_stud_info (user_id, ${fields.map(field => field.split(' ')[0]).join(', ')})
                    VALUES (?, ${fields.map(() => '?').join(', ')});
                `;
                values.unshift(student_id);
                await pool.execute(insertQuery, values);
                return true; // Successfully inserted
            }
        } catch (error) {
            throw new Error("Error updating student info: " + error.message);
        }
    },
};

module.exports = addStudentInfo;
