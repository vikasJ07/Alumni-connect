const { v4: uuidv4 } = require('uuid');
const commentModel = require("../models/commentModel");

const addComment = async (req, res) => {
    const { postId, userId, userType, content } = req.body;
    const commentId = uuidv4();
    
    try {
        await commentModel.addComment(commentId, postId, userId, userType, content);

        const newComment = await commentModel.getCommentById(commentId);

        res.json({ message: 'Comment added successfully',
            newComment
        });
    } catch (err) {
        console.error("Error adding comment:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getComments = async (req, res) => {
    const { postId } = req.query;
    
    try {
        const comments = await commentModel.getCommentsByPostId(postId);
        res.json(comments);
    } catch (err) {
        console.error("Error fetching comments:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    addComment,
    getComments
};
