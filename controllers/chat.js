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

// find user's chats
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId) 
        const chats = await Chat.find({
            members: {$in: [user]}
        })

        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// find specific chat 
router.get('/:user1/:user2', async (req, res) => {
    try {
        const user1 = await User.findById(req.params.user1)
        const user2 = await User.findById(req.params.user2)

        const chat = await Chat.find({
            members: {$all: [user1, user2] }
        })

        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// delete chat 
router.delete('/:chatId', async (req, res) => {
    try {
        const chatId = await Chat.findById(req.params.chatId)

        const deleteChat = await Chat.findByIdAndDelete(chatId)
        res.status(200).json(deleteChat)
        
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router;
