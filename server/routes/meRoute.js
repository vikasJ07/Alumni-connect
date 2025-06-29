const express = require('express')

//controller functions
const {signupUser, loginUser,getProfileDetails, logoutUser} = require('../controllers/userController')
const  verifyToken  = require('../middlewares/requireAuth')
const router = express.Router()


router.get("/",verifyToken,getProfileDetails)


router.post("/logout",logoutUser)




module.exports = router