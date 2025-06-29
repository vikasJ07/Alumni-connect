const express = require('express');
const {signupAlumni, loginAlumni, dashboardAlumni, requestSignup, removeAlumni, checkAlumni} = require('../controllers/alumniController');
const multer = require('multer');

const router = express.Router();

//Middleware make a separate file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/'); // Save the files to 'uploads' directory( the problem now is even if signup is unsucessful the image is 
                                //getting stored in uploads folder which will create memory overhead ithink work on this later)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + file.originalname;
        cb(null, uniqueSuffix);
    },
});

const upload = multer({ storage });

//Multiple files upload with diff fields
router.post('/signup', upload.fields([
    { name: 'document', maxCount: 1 },
    { name: 'profilePhoto', maxCount: 1 }
]), requestSignup);
// router.post('/reqSignup', requestSignup )
router.post('/login', loginAlumni);
router.get('/dashboard', dashboardAlumni);
router.post("/removeAlumni", removeAlumni);
router.post("/check",checkAlumni);

module.exports = router;
