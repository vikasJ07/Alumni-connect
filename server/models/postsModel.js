const { pool } = require('../db'); // Importing the pool from your db connection

const Post = {
    // Create a new post
    create: async (alumniId, postUrls, description) => {
        const query = `
            INSERT INTO posts (alumni_id, post, description)
            VALUES (?, ?, ?);
        `;
        try {
            const [result] = await pool.execute(query, [alumniId, JSON.stringify(postUrls), description]);
            return result.insertId; // Returns the ID of the newly created post
        } catch (err) {
            throw new Error("Error creating post: " + err.message);
        }
    },

    // Get all posts : I THink this function is unecessary
    // getAll: async () => {
    //     const query = 'SELECT * FROM posts ORDER BY created_at DESC;';
    //     try {
    //         const [rows] = await pool.execute(query);
    //         return rows; // Returns all posts
    //     } catch (err) {
    //         throw new Error("Error fetching posts: " + err.message);
    //     }
    // },

    // Get posts by alumni ID
    getAllPostsByAlumniId: async (alumniId) => {
        const query = 'SELECT * FROM posts WHERE alumni_id = ? ORDER BY created_at DESC;';
        try {
            const [rows] = await pool.execute(query, [alumniId]);
            return rows; // Returns posts for the specified alumni
        } catch (err) {
            throw new Error("Error fetching posts for alumni: " + err.message);
        }
    },

    // Update post description
    update: async (id, postUrls, description) => {
        const query = `
            UPDATE posts
            SET post = ?, description = ?
            WHERE id = ?;
        `;
        try {
            const [result] = await pool.execute(query, [JSON.stringify(postUrls), description, id]);
            return result.affectedRows > 0;
        } catch (err) {
            throw new Error("Error updating post: " + err.message);
        }
    },

    // Delete a post by post ID
    delete: async (id) => {
        const query = 'DELETE FROM posts WHERE id = ?;';
        try {
            const [result] = await pool.execute(query, [id]);
            return result.affectedRows > 0;
        } catch (err) {
            throw new Error("Error deleting post: " + err.message);
        }
    },

    // Like a post (increase the like count)
    like: async (id) => {
        const query = `
            UPDATE posts
            SET likes_count = likes_count + 1
            WHERE id = ?;
        `;
        try {
            const [result] = await pool.execute(query, [id]);
            return result.affectedRows > 0; // Returns true if the like count was incremented
        } catch (err) {
            throw new Error("Error liking post: " + err.message);
        }
    },

    getPostsByAuthors: async (authorIds) => {
        const query = `
          SELECT p.id, p.description, p.post, p.likes_count, p.created_at, a.username , a.profile_photo
          FROM posts p
          JOIN Alumni a ON p.alumni_id = a.id
          WHERE p.alumni_id IN (${authorIds.map(() => "?").join(",")});
        `;
        try {
          const [rows] = await pool.execute(query, authorIds);
          return rows; // Return all matching posts
        } catch (error) {
          throw new Error("Error retrieving posts: " + error.message);
        }
      },
};

module.exports = Post;
