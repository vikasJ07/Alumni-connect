const express = require('express');
const { upload, cleanUpFile } = require('../middlewares/fileHandler');
const verifyToken = require('../middlewares/requireAuth')

const {getProfileDetailsOfAlumni, updateAlumniProfileDetails, getSuggestedAlumnis, getAdditionalInfoOfAlumni, updateAdditionalInfo, alumniSearchBar} = require('../controllers/alumniDashController')



const router = express.Router();



router.get('/profiledetails', getProfileDetailsOfAlumni);

router.get('/addInfo', getAdditionalInfoOfAlumni);

router.post('/updateAddInfo',updateAdditionalInfo);

router.post('/profileupdate', upload.single('profile_photo'), updateAlumniProfileDetails)

router.get('/suggest', getSuggestedAlumnis)

router.get('/search', alumniSearchBar)


module.exports = router;