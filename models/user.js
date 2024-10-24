const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    }, 
    
    lastname: {
        type: String,
        required: true,
    }, 
    email: {
        type: String,
        required: true,
    }, 

    isPublic: {
        type: Boolean,
        default: true,
    },

    username: {
        type: String,
        unique: true,
        required: true
    },

    hashedPassword: {
        type: String,
        required: true
    },

    followers: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    }],

    following: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    }],

});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.hashedPassword;
    }
});

module.exports = mongoose.model('User', userSchema);