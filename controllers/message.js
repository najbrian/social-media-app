const express = require('express')
const verifyToken = require('../middleware/verify-token')
const Chat = require('../models/chat')
const User = require('../models/user')
const Message = require('../models/message')
const router = express.Router()

// ========== Public Routes ===========

// ========= Protected Routes =========
router.use(verifyToken)

// create message 
router.post('/:chatId', async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const { text } = req.body; 
        const sender = req.user._id; 

        const chat = await Chat.findById(req.params.chatId);
        
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }

        const newMessage = new Message({
            sender: sender,
            text: text,
            isRead: false  
        });

        await newMessage.save();

        chat.messages.push(newMessage._id);
        await chat.save();

        res.status(200).json(newMessage);

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// edit message
router.put ('/:messageId', async (req, res) => {
    try {
        const message = await Message.findById(req.params.messageId);

        // checks if the recipe author is authorized to update
        if (!message.sender.equals(req.user._id)) {
            return res.status(403).send("You are not authorize to do that!");
        }

        const editedMsg = await Message.findByIdAndUpdate(
            req.params.messageId,
            req.body,
            { new: true }
        );

        editedMsg._doc.sender = req.user;

        res.status(200).json(editedMsg);

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}) 


// delete message 
router.delete ('/:messageId/delete', async (req, res) => {
    try {
        const message = await Message.findById(req.params.messageId);
         // checks if the recipe author is authorized to update
        if (!message.sender.equals(req.user._id)) {
            return res.status(403).send("You are not authorize to do that!");
        }

        const deletedMsg = await Message.findByIdAndDelete(req.params.messageId)

        res.status(200).json(deletedMsg);

    } catch (error) {
         res.status(500).json({ error: error.message })
    }
})


module.exports = router;

