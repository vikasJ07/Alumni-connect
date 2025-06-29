const express = require('express');
const { adminLogin, approveOrReject, pendingRequests, FetchAllAlumniData, getDetails } = require('../controllers/adminController');
const AlumniModel = require('../models/alumniModel');
const Pending = require('../models/pendingModel');

const router = express.Router();

// Admin login route
router.post('/login', adminLogin);

router.post('/approveReject', approveOrReject);

router.get('/pendingRequests', pendingRequests);

router.get('/allData', FetchAllAlumniData);

router.get('/filter',getDetails)

module.exports = router;
