const {pool} = require("../db")

const Friends = {
    // Add a friend in both directions
    // add: async (alumni_id, friend_id) => {
    //   console.log(friend_id)
    //     const query = `
    //         INSERT IGNORE INTO friends (alumni_id, friend_id) VALUES (?, ?), (?, ?);
    //     `;
    //     try {
    //         const [result] = await pool.execute(query, [alumni_id, friend_id, friend_id, alumni_id]);
    //         console.log("Database Insert Result:", result);
    //         return result.affectedRows > 0; // Returns true if at least one row was inserted
    //     } catch (error) {
    //         throw new Error("Error adding friend: " + error.message);
    //     }
    // },

    add: async (alumni_id, friend_id) => {
      // Check if friend_id exists in either Alumni or Users
      const checkAlumniQuery = `SELECT 1 FROM Alumni WHERE id = ?`;
      const checkUserQuery = `SELECT 1 FROM Users WHERE id = ?`;
  
      try {
          // Check Alumni
          const [alumniRows] = await pool.execute(checkAlumniQuery, [friend_id]);
  
          // Check Users if not found in Alumni
          if (alumniRows.length === 0) {
              const [userRows] = await pool.execute(checkUserQuery, [friend_id]);
              if (userRows.length === 0) {
                  throw new Error("Friend ID not found in Alumni or Users table.");
              }
          }
  
          // Check if friendship already exists
          const existsQuery = `
              SELECT 1 FROM friends 
              WHERE (alumni_id = ? AND friend_id = ?)
              OR (alumni_id = ? AND friend_id = ?);
          `;
          const [existing] = await pool.execute(existsQuery, [alumni_id, friend_id, friend_id, alumni_id]);
  
          if (existing.length > 0) {
              return { success: false, message: "Friendship already exists" };
          }
  
          // Insert friendship in both directions
          const insertQuery = `
              INSERT INTO friends (alumni_id, friend_id) 
              VALUES (?, ?), (?, ?);
          `;
          const [result] = await pool.execute(insertQuery, [
              alumni_id, friend_id,
              friend_id, alumni_id
          ]);
  
          return { success: result.affectedRows > 0, message: "Friend added successfully" };
      } catch (error) {
          console.error("SQL Error:", error);
          throw new Error("Error adding friend: " + error.message);
      }
  },   

    // List all friends for a given alumni_id
    list: async (alumni_id) => {
        const query = `
            SELECT 
    COALESCE(a.id, u.id) AS id,
    COALESCE(a.username, u.username) AS username,
    a.name,
    COALESCE(a.profile_photo, u.profile_photo) AS profile_photo
FROM friends f
LEFT JOIN Alumni a ON a.id = f.friend_id
LEFT JOIN users u ON u.id = f.friend_id
WHERE f.alumni_id = ?;
        `;
        try {
            const [rows] = await pool.execute(query, [alumni_id]);
            return rows; // Returns the list of friends
        } catch (error) {
            throw new Error("Error retrieving friends: " + error.message);
        }
    },

    // This has been done for the study Purpose only 🤣🤣🤣
//     listUserFriends: async (user_id) => {
//       const query = `
//           SELECT 
//     COALESCE(a.id, u.id) AS id,
//     COALESCE(a.username, u.username) AS username,
//     a.name,
//     COALESCE(a.profile_photo, u.profile_photo) AS profile_photo
// FROM friends f
// LEFT JOIN Alumni a ON a.id = f.friend_id
// LEFT JOIN users u ON u.id = f.friend_id
// WHERE f.alumni_id = ?;
//       `;
//       try {
//           const [rows] = await pool.execute(query, [user_id]);
//           return rows; // Returns the list of friends
//       } catch (error) {
//           throw new Error("Error retrieving friends: " + error.message);
//       }
//   },

    // Remove a friend relationship in both directions
  remove: async (alumni_id, friend_id) => {
    const query = `
      DELETE FROM friends 
      WHERE (alumni_id = ? AND friend_id = ?) 
         OR (alumni_id = ? AND friend_id = ?);
    `;
    try {
      const [result] = await pool.execute(query, [alumni_id, friend_id, friend_id, alumni_id]);
      return result.affectedRows > 0; // Returns true if at least one row was deleted
    } catch (error) {
      throw new Error("Error removing friend: " + error.message);
    }
  },

  // Check if two users are friends
  isFriend: async (alumni_id, friend_id) => {
    const query = `
      SELECT 1 
      FROM friends 
      WHERE (alumni_id = ? AND friend_id = ?) 
         OR (alumni_id = ? AND friend_id = ?)
      LIMIT 1;
    `;
    try {
      const [rows] = await pool.execute(query, [alumni_id, friend_id, friend_id, alumni_id]);
      return rows.length > 0; // Returns true if they are friends
    } catch (error) {
      throw new Error("Error checking friendship: " + error.message);
    }
  },

  // List mutual friends between two users
  mutual: async (alumni_id, other_alumni_id) => {
    const query = `
      SELECT a.id, a.username, a.name, a.profile_photo
      FROM friends f1
      JOIN friends f2 ON f1.friend_id = f2.friend_id
      JOIN Alumni a ON a.id = f1.friend_id
      WHERE f1.alumni_id = ? AND f2.alumni_id = ?;
    `;
    try {
      const [rows] = await pool.execute(query, [alumni_id, other_alumni_id]);
      return rows; // Returns the list of mutual friends
    } catch (error) {
      throw new Error("Error retrieving mutual friends: " + error.message);
    }
  },

  // Count the number of friends for a given alumni_id
  count: async (alumni_id) => {
    const query = `
      SELECT COUNT(*) AS total_friends
      FROM friends
      WHERE alumni_id = ?;
    `;
    try {
      const [rows] = await pool.execute(query, [alumni_id]);
      return rows[0].total_friends; // Returns the total number of friends
    } catch (error) {
      throw new Error("Error counting friends: " + error.message);
    }
  },
  // Get all friends' IDs for a given alumni
  getFriendsIds: async (alumni_id) => {
    const query = `
      SELECT friend_id 
      FROM friends 
      WHERE alumni_id = ?;
    `;
    try {
      const [rows] = await pool.execute(query, [alumni_id]);
      return rows.map(row => row.friend_id); // Return only friend IDs
    } catch (error) {
      throw new Error("Error retrieving friends' IDs: " + error.message);
    }
  },
}

module.exports = Friends;