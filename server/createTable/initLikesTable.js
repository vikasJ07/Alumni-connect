
const { pool } = require('../db');

const initLikeTable = async () => {
  try {
    const likeTableQuery = `
      CREATE TABLE IF NOT EXISTS Likes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        post_id INT NOT NULL,
        user_id CHAR(36) NOT NULL,
        user_type ENUM('User', 'Alumni') NOT NULL,
        UNIQUE (post_id, user_id, user_type),
        FOREIGN KEY (post_id) REFERENCES Posts(id) ON DELETE CASCADE
      );
    `;
    await pool.execute(likeTableQuery);
    console.log("Likes table created successfully.");
  } catch (error) {
    console.error("Error creating Likes table:", error);
  }
};

initLikeTable();
