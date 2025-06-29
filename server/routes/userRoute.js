const express = require('express')
const { upload, cleanUpFile } = require('../middlewares/fileHandler');
//controller functions
const {signupUser, loginUser,getProfileDetails, logoutUser, getStudentProfile, getAddStudentInfo, updateStudentProfile, updateAddStudentInfo} = require('../controllers/userController')
const  verifyToken  = require('../middlewares/requireAuth')
const router = express.Router()



//login route
router.post('/login', loginUser)


//Siign up Route
router.post('/signup',upload.single('profilePhoto'), signupUser)
//Logout Route
router.post('/logout',logoutUser)

router.get("/me",verifyToken,getProfileDetails)//Serioulsy i dont remember why i did this sorry guys


//Get the full profile details of the student with specific id
router.get('/profile' , getStudentProfile)

router.get('/addStudInfo', getAddStudentInfo)

router.post('/update/profiledetails',upload.single('profile_photo'), updateStudentProfile)

router.post('/update/studentaddinfo', updateAddStudentInfo)

module.exports = router