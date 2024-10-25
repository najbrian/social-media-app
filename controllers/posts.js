const express = require('express')
const verifyToken = require('../middleware/verify-token')
const Post = require('../models/post')
const router = express.Router()

// ========== Public Routes ===========

// ========= Protected Routes =========
router.use(verifyToken)
router.post('/', async (req, res) => {
    try {
      req.body.author = req.user._id
      const post = await Post.create(req.body)
      post._doc.author = req.user
      res.status(201).json(post)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: error.message })
    }
})

module.exports = router