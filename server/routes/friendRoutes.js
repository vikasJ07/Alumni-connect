const express = require('express');

const { connectToFriend, displayAllFriends, displayAllFriendsForUser, followerCount } = require('../controllers/friendController')


const router = express.Router();

router.post('/connect', connectToFriend);

router.get('/display', displayAllFriends);

router.get('/displayuser',displayAllFriendsForUser);

router.get('/count',followerCount);

module.exports = router;