const express = require('express')
const verifyToken = require('../middleware/verify-token')
const Chat = require('../models/chat')
const User = require('../models/user')
const router = express.Router()

// ========== Public Routes ===========

// ========= Protected Routes =========
router.use(verifyToken)

// create chat
router.post('/:user1/:user2', async (req, res) => {
    try {
        const user1 = await User.findById(req.params.user1)
        const user2 = await User.findById(req.params.user2)

        const chat = await Chat.findOne({
            members: { $all: [user1, user2] }
        })
        // if no chat exist, create new chat
        if (!chat) {
            const chat = new Chat ({
                members: [user1, user2]
            })

            await chat.save();
        }
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})



module.exports = router;
