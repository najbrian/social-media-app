const express = require('express');
const router = express.Router();
const Post = require('../models/post'); // Ensure this is the correct path to your Post model
const User = require('../models/user'); // Ensure this is the correct path to your User model
const verifyToken = require('../middleware/verify-token');

// Existing route for fetching a single user profile
router.get('/:userId', verifyToken, async (req, res) => {
    try {
        if (req.user._id !== req.params.userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await User.findById(req.user._id).populate('followers').populate('following');
        if (!user) {
            res.status(404);
            throw new Error('Profile not found.');
        }
        res.json({ user });
    } catch (error) {
        res.status(res.statusCode === 404 ? 404 : 500).json({ error: error.message });
    }
});

// New route for fetching posts by multiple user IDs
router.post('/following', verifyToken, async (req, res) => {
    const { userIds } = req.body;

    try {
        // Find posts where the author is in the list of userIds
        const posts = await Post.find({ author: { $in: userIds } }).populate('author');
        res.json(posts);
    } catch (error) {
        console.error("Error fetching posts for followed users", error);
        res.status(500).json({ error: "Error fetching posts" });
    }
});

module.exports = router;
