const AlumniModel = require('../models/alumniModel');
const Friends = require('../models/freindsModel')
const User = require('../models/userModel')




const connectToFriend = async (req, res) => {
    const { id, friend_id, friend_type } = req.body;

    if (!id || !friend_id || !friend_type) {
        return res.status(400).json({ message: "User ID, Friend ID, and Friend Type are required" });
    }

    if (friend_type !== "alumni" && friend_type !== "user") {
        return res.status(400).json({ message: "Invalid friend type. Must be 'alumni' or 'user'." });
    }

    try {
        // const alumni = await AlumniModel.findAlumniByUsername(username);

        // if (!alumni) {
        //     return res.status(404).json({
        //         message: "Alumni not found",
        //     });
        // }

        // if(alumni.id === friend_id){
        //     return res.status(400).json({
        //         message: "Cant send friend request to yourself"
        //     })
        // }

        const isAdded = await Friends.add(friend_id, id , friend_type);

        if (!isAdded) {
            return res.status(400).json({
                message: "Friendship could not be created",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Friend added successfully",
        });
    } catch (error) {
        console.error("Error connecting to friend:", error.message);
        return res.status(500).json({
            message: "An internal server error occurred",
            error: error.message,
        });
    }
};

const displayAllFriends = async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({
            message: "ID is required",
        });
    }

    try {
        // const alumni = await AlumniModel.findAlumniByUsername(username);
        // if (!alumni) {
        //     return res.status(404).json({
        //         message: "Alumni not found",
        //     });
        // }
        const friends = await Friends.list(id);

        return res.status(200).json({
            success: true,
            friends,
        });
    } catch (error) {
        console.error("Error displaying all friends:", error.message);
        return res.status(500).json({
            message: "An internal server error occurred",
            error: error.message,
        });
    }
};

const displayAllFriendsForUser = async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({
            message: "ID is required",
        });
    }

    try {
        
        const friends = await Friends.listUserFriends(id);

        return res.status(200).json({
            success: true,
            friends,
        });
    } catch (error) {
        console.error("Error displaying all friends:", error.message);
        return res.status(500).json({
            message: "An internal server error occurred",
            error: error.message,
        });
    }
};

const followerCount = async (req, res) => {
    try {
        const { id } = req.query;
        const data = await Friends.count(id);
        return res.json({ data });
    } catch (error) {
        console.error("Error fetching follower count:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};



module.exports = { connectToFriend , displayAllFriends, displayAllFriendsForUser, followerCount}