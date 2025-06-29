const {pool} = require('../db');

// Initialize Notification Table
const initNotificationTable = async () => {
  
  try {
    const query = `
    CREATE TABLE IF NOT EXISTS notifications (
      id INT PRIMARY KEY AUTO_INCREMENT,
      audience VARCHAR(50) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
    await pool.execute(query);
    console.log('Notification table initialized.');
  } catch (error) {
    console.error('Error initializing notification table:', error);
  }
};

initNotificationTable();
