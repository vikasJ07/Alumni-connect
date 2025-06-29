// models/likeModel.js
const { pool } = require('../db');

const Like = {
  addLike: async (postId, userId, userType) => {
    const likeQuery = `
      INSERT INTO Likes (post_id, user_id, user_type) 
      VALUES (?, ?, ?)
    `;
    await pool.execute(likeQuery, [postId, userId, userType]);
  },

  checkIfLiked: async (postId, userId, userType) => {
    const checkQuery = `
      SELECT * FROM Likes 
      WHERE post_id = ? AND user_id = ? AND user_type = ?
    `;
    const [rows] = await pool.execute(checkQuery, [postId, userId, userType]);
    return rows.length > 0;
  },

  removeLike: async (postId, userId, userType) => {
    const removeQuery = `
      DELETE FROM Likes 
      WHERE post_id = ? AND user_id = ? AND user_type = ?
    `;
    await pool.execute(removeQuery, [postId, userId, userType]);
  },

  getLikesCount: async (postId) => {
    const countQuery = `
      SELECT COUNT(*) as count 
      FROM Likes 
      WHERE post_id = ?
    `;
    const [rows] = await pool.execute(countQuery, [postId]);
    return rows[0].count;
  }
};

module.exports = Like;
