const mongoose = require('mongoose');
const transformSchema = require('./utils/schemaTransform');
import Comment from './comment'

const UserPostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    caption: String,
    comments: [Comment]
}, {
    versionKey: false, timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('UserPost', transformSchema(UserPostSchema));