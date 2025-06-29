const {pool} = require('../db');

const Notification = {
    createNotification : async (audience, message) => {
        const query = 'INSERT INTO notifications (audience, message, created_at) VALUES (?, ?, NOW())';
        await pool.query(query, [audience, message]);
      },

    fetchNotifications : async (role) => {
        let query = 'SELECT * FROM notifications WHERE audience = ? OR audience = ? ORDER BY created_at DESC';
        const values = [role, 'Both'];
        
        const [rows] = await pool.query(query, values);
        return rows;
      },
}


module.exports = Notification;
