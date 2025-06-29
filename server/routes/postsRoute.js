const express = require('express');
const { upload, cleanUpFile } = require('../middlewares/fileHandler');
const verifyToken = require('../middlewares/requireAuth')

const {addPost, getAllPostsOfAlumni, increaseLikeCount, deletePost, getRandomPosts} = require('../controllers/postsController')



const router = express.Router();

router.post('/add',upload.array('post'), addPost); //keep the name of formdata as posts in frontend
// router.post('/add', addPost);

router.get('/randomPosts',getRandomPosts);

router.get('/allposts',getAllPostsOfAlumni); // Gett all posts of a alumni

router.post('/likecount',increaseLikeCount); // INcrease the total like count of the post

router.delete('/delete', deletePost); // Delete the post

module.exports = router;