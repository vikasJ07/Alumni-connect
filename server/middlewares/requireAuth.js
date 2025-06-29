const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const AlumniModel = require('../models/alumniModel')
const Admin = require('../models/adminModel')
const Pending = require('../models/pendingModel')
// const requireAuth = async (req, res, next) => {

//     //verify authentication
//     const { authorization } = req.headers

//     if(!authorization){
//         return res.status(401).json({error: 'Authorization token required'})
//     }

//     const token = authorization.split(' ')[1]

//     try{
//         const {_id} = jwt.verify(token, process.env.SECRET)

//         req.user = await User.findOne({ _id }).select('_id')
//         next()

//     }catch(error){
//         console.log(error)
//         res.status(401).json({error: 'Request not Authorized'})
//     }

// }

// module.exports = requireAuth




 const verifyToken = async (req, res, next) => {
    const token = req.cookies["token"];
          // console.log(token)
    if (!token) {
            //  console.log("token missing")
             return;
    }
  
    try {
      // Decode the token
      const decoded = jwt.verify(token, process.env.SECRET);
      const { _id, role } = decoded;
      // console.log(decoded)
      let data;
      let username;
      let id;

      if(role == "user"){
        data = await User.findById(_id)
        username = data.username
        id = data.id
      }else if(role == "alumni"){
        data = await AlumniModel.findById(_id)
        username = data.username
        id = data.id
      }else if(role == "admin"){
        
        username = "Admin"
        id = data.id
      }else if(role == "pending"){
        data = await Pending.findAlumniById(_id)
        if(data == null){
          data = await AlumniModel.findById(_id)
        }
        console.log(data)
        username = data.username
      }
      //  console.log(id)
       req.user={
        id,
        username,
        role:role,
        token
       }
  
      next();
    } catch (error) {
                    console.log(error)
    }
  };

  module.exports=verifyToken