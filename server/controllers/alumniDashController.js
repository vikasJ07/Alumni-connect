const AlumniModel = require('../models/alumniModel');
const User = require('../models/userModel')
const AdditionalInfo = require('../models/additionalInfoModel')
const cloudinary = require('cloudinary').v2


const getProfileDetailsOfAlumni = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ success: false, message: "Username is required." });
        }

        const data = await AlumniModel.findById(id);

        if (!data) {
            return res.status(404).json({ success: false, message: "Alumni not found." });
        }

        if (data.isPending || data.isRejected) {
            return res.status(403).json({ success: false, message: "Profile is pending or rejected." });
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Error fetching alumni details:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};


const updateAlumniProfileDetails = async (req, res) => {
    try {
        const { username, name, email, graduationYear, companyName, companyLocation, address} = req.body;
        const profile_photo = req.file ? req.file.path : null;
        let profilePhotoUrl = null;
        console.log(profile_photo)

        if(!profile_photo){
            const user = await AlumniModel.findAlumniByUsername(username);
            // console.log(user)
            profilePhotoUrl = user.profile_photo;
        }



        const alumni = await AlumniModel.findAlumniByUsername(username);
        if (!alumni) {
            return res.status(404).json({ success: false, message: "Alumni profile not found." });
        }
        //If request was pending or rejected dont allow for updating
        if (alumni.isPending || alumni.isRejected) {
            return res.status(403).json({ success: false, message: "Profile is pending or rejected." });
        }

        
        if (profile_photo) {
            const uploadResult = await cloudinary.uploader.upload(profile_photo, {
                folder: 'alumni_profile_photos', // Cloudinary folder for profile photos
                resource_type: 'image',         // Since it's an image file
            });
            profilePhotoUrl = uploadResult.secure_url; // Store the secure URL
        }
        console.log(profilePhotoUrl);
        
        const updates = {
            name,
            email,
            graduationYear,
            companyName,
            companyLocation,
            address,
            profilePhotoUrl,
        };

        // Update the alumni profile
        const result = await AlumniModel.update(alumni.id, updates);

        if (result.affectedRows === 0) {
            return res.status(500).json({ success: false, message: "Failed to update the profile." });
        }

        // Respond with the updated profile
        const updatedProfile = await AlumniModel.findById(alumni.id);
        res.status(200).json({ success: true, data: updatedProfile });
    } catch (error) {
        console.error("Error updating alumni profile:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

const getSuggestedAlumnis = async (req, res) => {
    // const { username } = req.user; //if i use middleware it will be in req.user
    const { id } = req.query; //Query Parameters

    try {
        if (!id) {
            return res.status(400).json({ success: false, message: "Username is required." });
        }
        // const alumni = await AlumniModel.findById(id);
        

        

        const randomAlumni = await AlumniModel.getRandomAlumni(id);
        if (randomAlumni.length === 0) {
            return res.status(404).json({ success: false, message: "No alumni found." });
        }

        //The Response Data will have a array of size THree
        res.status(200).json({ success: true, data: randomAlumni });
    } catch (error) {
        console.error("Error fetching suggested alumni:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

const getAdditionalInfoOfAlumni = async (req, res) => {
    const { id } = req.query; 
    try {
        const alumni = await AdditionalInfo.get(id);
        return res.status(200).json({
            message: "All good here",
            data: alumni,
        });
    } catch (error) {
        console.error("Error fetching additional info:", error.message);
        return res.status(500).json({
            message: "Failed to fetch additional info",
            error: error.message,
        });
    }
};

const updateAdditionalInfo = async (req, res) => {
    const { alumni_id, hobbies, about } = req.body;

    // Validate required fields
    if (!alumni_id) {
        return res.status(400).json({ message: "Alumni ID is required." });
    }

    try {
        const result = await AdditionalInfo.update(alumni_id, { hobbies, about });
        console.log(result);
        if (result) {
            return res.status(200).json({
                message: "Additional info updated successfully.",
            });
        } else {
            return res.status(404).json({
                message: "Alumni not found or no changes made.",
            });
        }
    } catch (error) {
        console.error("Error updating additional info:", error.message);
        return res.status(500).json({
            message: "Failed to update additional info.",
            error: error.message,
        });
    }
};

const alumniSearchBar = async (req, res) => {
    try {
        const data = await AlumniModel.fetchAlumniDetails(); // Await the async function
        res.json({ data });
    } catch (error) {
        console.error("Error fetching alumni details:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


module.exports = {getProfileDetailsOfAlumni, updateAlumniProfileDetails, getSuggestedAlumnis, getAdditionalInfoOfAlumni, updateAdditionalInfo, alumniSearchBar};