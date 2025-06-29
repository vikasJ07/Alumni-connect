const AlumniModel = require('../models/alumniModel');
const Pending = require('../models/pendingModel');
const CollegeDb = require("../models/collegeDBModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2

const createToken = (_id, role) => {
    return jwt.sign({ _id: _id, role: role }, process.env.SECRET, { expiresIn: '3d' });
};

const cookieOptions = {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: false,
   // Ensures cookies are sent over HTTPS
    sameSite: "lax", // Adjust if cross-site requests are involved ('none' for full cross-origin cookies)
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
  };


const loginAlumni = async (req, res) => {
    const { username, password , role} = req.body;

    try {
        // Find the alumni by username
        const alumni = await AlumniModel.findAlumniByUsername(username);

        if (!alumni) {
            return res.status(400).json({ error: 'Invalid username or password.' });
        }

        // Validate the password
        const isMatch = await bcrypt.compare(password, alumni.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid username or password.' });
        }

        const token = createToken(alumni.id, role);

        res.cookie("token", token, cookieOptions).status(200).json({ username: alumni.username, token , role, id:alumni.id});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error.' });
    }
};


const signupAlumni = async (req, res) => {
    const { username, password, name, email, graduationYear, role } = req.body;
    const documentPath = req.file ? req.file.path : null;
    // console.log(req.file)


    if (!documentPath) {
        return res.status(400).json({ message: 'Graduation document is required.' });
    }

    try {
        const existingUsername = await AlumniModel.findAlumniByUsername(username);
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already exists.' });
        }

        const existingEmail = await AlumniModel.findAlumniByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: 'alumni_documents', // Cloudinary folder to store documents
            resource_type: 'auto',     // Automatically detect file type
        });

        const documentPath = uploadResult.secure_url;

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAlumni = await AlumniModel.createAlumni({
            username,
            password: hashedPassword,
            name,
            email,
            graduationYear,
            documentPath,
        });

        const token = createToken(newAlumni.id, role);

        res.cookie("token", token, cookieOptions).status(201).json({
            message: 'Alumni registered successfully!',
            token,
            username,
            role,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering alumni.' });
    }
};

//Dont realy need this as of now but good to go
const dashboardAlumni = (req, res) => {
    res.status(200).json({ message: 'Welcome to the Alumni Dashboard!' });
};

const requestSignup = async(req, res) =>{
    const { username, password, name, email, graduationYear, companyName,companyLocation, address } = req.body;
    // Accessing the uploaded files
    const document = req.files['document'] ? req.files['document'][0] : null;
    const profilePhoto = req.files['profilePhoto'] ? req.files['profilePhoto'][0] : null;
    // console.log(req.file)


    if (!document) {
        return res.status(400).json({ message: 'Graduation document is required.' });
    }


    if(!profilePhoto){
        return res.status(400).json({ message: 'Profile Photo is required.' });
    }

    try {
        const existingUsername = await AlumniModel.findAlumniByUsername(username);
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already exists.' });
        }

        const existingEmail = await AlumniModel.findAlumniByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        let documentUrl = null;
        let profilePhotoUrl = null;

        if (document) {
            const uploadResult = await cloudinary.uploader.upload(document.path, {
                folder: 'alumni_documents', // Cloudinary folder to store documents
                resource_type: 'auto',      // Automatically detect file type (image, PDF, etc.)
            });
            documentUrl = uploadResult.secure_url; // Store the secure URL
        }

        if (profilePhoto) {
            const uploadResult = await cloudinary.uploader.upload(profilePhoto.path, {
                folder: 'alumni_profile_photos', // Cloudinary folder for profile photos
                resource_type: 'image',         // Since it's an image file
            });
            profilePhotoUrl = uploadResult.secure_url; // Store the secure URL
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAlumni = await AlumniModel.createAlumni({
            username,
            password: hashedPassword,
            name,
            email,
            graduationYear,
            companyName,
            companyLocation,
            address,
            documentUrl,
            profilePhotoUrl,
            isPending: false,
            isRejected: false,
        });

        // const token = createToken(newAlumni.id, role);

        res.status(201).json({
            message: 'Alumni registered successfully!',
            username,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering alumni.' });
    }
    
}

const removeAlumni = async (req, res) => {
    const { username } = req.body;

    try {
        if (!username) {
            return res.status(400).json({ error: "Username is required." });
        }

        const alumni = await AlumniModel.findAlumniByUsername(username);
        if (!alumni) {
            return res.status(404).json({ error: "Alumni not found." });
        }

        // Remove the alumni from the database
        await AlumniModel.removeAlumniByUsername(username);
        res.status(200).json({ message: "Rejected alumni successfully removed." });
    } catch (error) {
        console.error("Error removing alumni:", error);
        res.status(500).json({ error: "Failed to remove alumni." });
    }
}

const checkAlumni = async (req, res) =>{
    const { usn } = req.body;

    if (!usn) {
        return res.status(400).json({ error: "USN is required" });
    }

    try {
        const alumni = await CollegeDb.findByUSN(usn);

        if (alumni) {
            res.json({ exists: true, message: "USN found in database", alumni });
        } else {
            res.json({ exists: false, message: "USN not found" });
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


module.exports = {signupAlumni,  loginAlumni, dashboardAlumni, requestSignup, removeAlumni, checkAlumni};
