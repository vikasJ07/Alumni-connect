const express = require('express');
const { likePost, getLikesCount, checkIfLiked } = require('../controllers/likeController');
const router = express.Router();



router.post('/', likePost);

router.get('/count', getLikesCount);

router.get('/check', checkIfLiked);

module.exports = router;
