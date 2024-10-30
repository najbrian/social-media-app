const express = require('express');
const router = express.Router();
const verifyToken = require('../verifyToken');
const User = require('../models/user');
const FollowRequest = require('../models/followrequest');
// ========== Public Routes ===========


// ========= Protected Routes =========
router.use(verifyToken)
//View Profile Route
router.get('/:userId', async (req, res) => {
  const requestingUser = req.user._id
  const viewUser = req.params.userId
  try {
    if (await FollowRequest.findOne({ requester: requestingUser, recipient: viewUser, status: 'approved' })) {
      const user = await User.findById(viewUser)
      .populate('followers')
      .populate('following')
      return res.status(200).json(user)
    } else {
      return res.status(403).json({ error: `You are not following ${User.findById(viewUser).username}` })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})