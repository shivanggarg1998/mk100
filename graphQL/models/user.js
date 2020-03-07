const mongoose = require('mongoose');
const transformSchema = require('./utils/schemaTransform');
import Address from './address';

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    username: {
        type: String
    },
    mobile: String,
    name: String,
    image: String,
    about: String,
    facebook: String,
    address: [Address],
    finished: {
        signup: {
            type: Boolean,
            default: false
        }
    },
    public: {
        type: Boolean,
        default: false
    },
    categories: [{
        type: String
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    followingShop: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller'
    }],
    followNotify: [{
        User: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        read: Boolean
    }],
    UserToken: String,
}, {
    versionKey: false
});

module.exports = mongoose.model('User', transformSchema(userSchema));