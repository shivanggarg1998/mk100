const mongoose = require('mongoose');
import Comment from './comment'
const transformSchema = require('./utils/schemaTransform');

const SellerpostSchema = new mongoose.Schema({
    image: String,
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller'
    },
    caption: String,
    liked_by: [{
        type: mongoose.Schema.Types.ObjectId ,
        ref : 'User'
    }],
    comments: {
        type: [Comment],
        default: []
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});


SellerpostSchema.virtual('likes').get(function () {
    return (this.liked_by) ? this.liked_by.length : 0 ;
});

module.exports = mongoose.model('Sellerpost', transformSchema(SellerpostSchema));