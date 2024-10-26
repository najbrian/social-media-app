const mongoose = require('mongoose');

// const messageSchema = new mongoose.Schema(
//     {
//         author: { 
//             type: mongoose.Schema.Types.ObjectId, 
//             ref: 'User',
//         },
//         text: {
//             type: String, 
//             required: true
//         }, 
//         isRead: {
//             type: Boolean, 
//             default: false, 
//         }
//     }, 
//     { timestamps: true },
// );

const chatSchema = new mongoose.Schema(
    {
        members: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
        }],

        messages: [{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Message',
        }],
    }, 
    {timestamps: true }
);

const chatModel = mongoose.model('Chat', chatSchema);

module.exports = chatModel;

