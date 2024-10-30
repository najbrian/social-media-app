const express = require('express');
const verifyToken = require('../middleware/verify-token')
const FollowRequest = require('../models/followrequest')
const router = express.Router()

// ========== Public Routes ===========
// ========= Protected Routes =========
router.use(verifyToken)

// Create Follow Request Route
router.post('/:user1/:user2', async (req, res) => {
  try {
    user1 = req.params.user1
    user2 = req.params.user2

    if (user1 === user2) {
      return res.status(400).json({ error: 'You cannot follow yourself' })
    }

    const [existingPendingOrRejectedRequest, existingApprovedRequest] = await Promise.all([
      FollowRequest.findOne({ requester: user1, recipient: user2, status: { $in: ['pending', 'rejected'] } }),
      FollowRequest.findOne({ requester: user1, recipient: user2, status: 'approved' })
    ])

    if (existingPendingOrRejectedRequest) {
      return res.status(400).json({ error: 'Follow request already sent' })
    } else if (existingApprovedRequest) {
      return res.status(400).json({ error: 'You are already following this user' })
    }

    const followRequest = await FollowRequest.create({ requester: user1, recipient: user2 })
    res.status(201).json(followRequest)

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
})

// Get All Follow Requests Route
router.get('/incoming/:userId', async (req, res) => {
  try {
    if (req.params.userId !== req.user._id) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    const followRequests = await FollowRequest.find({ recipient: req.params.userId, status: 'pending' })
    .populate('requester')
    res.status(200).json(followRequests)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

//Approve or Reject Follow Request Route
router.patch('/:requestId', async (req, res) => {
  try {
    const followRequest = await FollowRequest.findById(req.params.requestId)
    if (!followRequest.recipient.equals(req.user._id)) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    if (req.body.status === 'approved') {
      followRequest.status = 'approved'
    } else if (req.body.status === 'rejected') {
      followRequest.status = 'rejected'
    } else {
      return res.status(400).json({ error: 'Invalid status' })
    }
    await followRequest.save()
    res.status(200).json(followRequest)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

//Unfollow Route
router.delete('/:user1/:user2', async (req, res) => {
  try {
    user1 = req.params.user1
    user2 = req.params.user2

    if (user1 === user2) {
      return res.status(400).json({ error: 'You cannot unfollow yourself' })
    }

    const followRequest = await FollowRequest.findOne({ requester: user1, recipient: user2, status: 'approved' })
    if (!followRequest) {
      return res.status(400).json({ error: 'You are not following this user' })
    }
// need to look into if I follow the user, how do I unfollow them
    await followRequest.delete()
    res.status(200).json(followRequest)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Block User Route
router.patch('/block/:user1/:user2', async (req, res) => {
  try {
    user1 = req.params.user1
    user2 = req.params.user2

    if (user1 === user2) {
      return res.status(400).json({ error: 'You cannot block yourself' })
    }

    const followRequest = await FollowRequest.findOne({ requester: user1, recipient: user2, status: { $in: ['approved','pending', 'rejected'] }  })
    if (!followRequest) {
      return res.status(400).json({ error: 'You are not following this user' })
    }

    followRequest.status = 'blocked'
    await followRequest.save()
    res.status(200).json(followRequest)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

//Get All Follow Requested Route
router.get('/outgoing/:userId', async (req, res) => {
  try {
    if (req.params.userId !== req.user._id) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    const followRequests = await FollowRequest.find({ requester: req.params.userId, status: 'pending' })
    .populate('recipient')
    res.status(200).json(followRequests)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router;
