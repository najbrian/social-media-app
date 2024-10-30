const mongoose = require('mongoose');

const followRequestSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    recipient: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'blocked'],
        default: 'pending'
    },
    created_at: { type: Date, default: Date.now }
});

const FollowRequest = mongoose.model('FollowRequest', followRequestSchema);

module.exports = FollowRequest;