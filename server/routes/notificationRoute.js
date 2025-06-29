const express = require('express');
const router = express.Router();
const { sendNotification, getNotifications } = require('../controllers/notificationController');

// POST Route to send notification
router.post('/send', sendNotification);


router.get('/', getNotifications);

module.exports = router;
