const express = require('express');
const router = express.Router();
const AlumniModel = require('../models/alumniModel');
const Pending = require('../models/pendingModel');
const  verifyToken  = require('../middlewares/requireAuth')

router.post('/checkRequestStatus', async (req, res) => {
    const { username } = req.body;

    try {
        if (!username) {
            return res.status(400).json({ error: 'Username is required.' });
        }

        const alumni = await AlumniModel.findAlumniByUsername(username);

        if (!alumni) {
            return res.status(404).json({ error: 'Alumni not found.' });
        }

        if (alumni.isPending) {
            res.status(200).json({ isPending: true });
        } else if (alumni.isRejected) {
            res.status(200).json({ isPending: false, isRejected: true, reason: alumni.rejectionReason || 'No reason provided.' });
        } else {
            res.status(200).json({ isPending: false, isRejected: false });
        }
    } catch (error) {
        console.error('Error checking request status:', error);
        res.status(500).json({ error: 'Failed to check request status.' });
    }
});


module.exports = router;