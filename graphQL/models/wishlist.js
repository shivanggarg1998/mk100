import mongoose from 'mongoose';
import transformSchema from './utils/schemaTransform';

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, {versionKey: false});

module.exports = mongoose.model('UserWishlist', transformSchema(wishlistSchema));