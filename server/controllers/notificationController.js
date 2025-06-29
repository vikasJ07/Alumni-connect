const Notification = require('../models/notificationModel');

// Send Notification
const sendNotification = async (req, res) => {
  const { audience, message } = req.body;

  if (!audience || !message) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  try {
    await Notification.createNotification(audience, message);
    res.status(200).json({ message: 'Notification sent successfully!' });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getNotifications = async (req, res) => {
    const { role } = req.query;
  
    if (!role) {
      return res.status(400).json({ error: 'Role is required' });
    }
  
    try {
      const notifications = await Notification.fetchNotifications(role);
      res.status(200).json({ notifications });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };

module.exports = {
  sendNotification,
  getNotifications
};
