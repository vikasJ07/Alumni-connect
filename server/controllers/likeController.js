// controllers/likeController.js
const Like = require('../models/likeModel');

const likePost = async (req, res) => {
  const { postId , userId, userType} = req.body;
  

  try {
    const hasLiked = await Like.checkIfLiked(postId, userId, userType);
    if (hasLiked) {
      await Like.removeLike(postId, userId, userType);
      return res.status(200).json({ message: 'Post unliked' });
    } else {
      await Like.addLike(postId, userId, userType);
      return res.status(200).json({ message: 'Post liked' });
    }
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getLikesCount = async (req, res) => {
  const { postId } = req.query;
  try {
    const count = await Like.getLikesCount(postId);
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching likes count:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const checkIfLiked = async (req, res) => {
    const { postId, userId, userType } = req.query;
    
    try {
        const isLiked = await Like.checkIfLiked(postId, userId, userType);
        res.json({ isLiked });
    } catch (err) {
        console.error("Error checking like status:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
  likePost,
  getLikesCount,
  checkIfLiked,
};
