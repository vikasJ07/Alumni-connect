// models/commentModel.js
const { pool } = require("../db");

const Comment = {
  addComment: async (commentId, postId, userId, userType, content) => {
    const query = `
      INSERT INTO comments (id, post_id, user_id, user_type, content) 
      VALUES (?, ?, ?, ?, ?)
    `;
    await pool.execute(query, [commentId, postId, userId, userType, content]);
  },

  getCommentsByPostId: async (postId) => {
    const query = `
      SELECT c.content, c.created_at, u.username, u.profile_photo 
      FROM comments c 
      JOIN users u ON c.user_id = u.id AND c.user_type = 'User'
      WHERE c.post_id = ?
      UNION
      SELECT c.content, c.created_at, a.username, a.profile_photo 
      FROM comments c 
      JOIN alumni a ON c.user_id = a.id AND c.user_type = 'Alumni'
      WHERE c.post_id = ?
      ORDER BY created_at ASC;
    `;
    const [rows] = await pool.execute(query, [postId, postId]);
    return rows;
  },

  getCommentById: async (commentId) => {
    const query = `
        SELECT c.id, c.content, c.created_at, u.username, u.profile_photo
        FROM comments c
        JOIN users u ON c.user_id = u.id AND c.user_type = 'User'
        WHERE c.id = ?
        UNION
        SELECT c.id, c.content, c.created_at, a.name AS username, a.profile_photo
        FROM comments c
        JOIN alumni a ON c.user_id = a.id AND c.user_type = 'Alumni'
        WHERE c.id = ?
        ORDER BY created_at ASC;
    `;
    const [rows] = await pool.query(query, [commentId, commentId]);
    return rows[0];
},

};

module.exports = Comment;
