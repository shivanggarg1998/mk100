const mongoose = require('mongoose');
const transformSchema = require('./utils/schemaTransform');

const cartSchema = new mongoose.Schema({
    items: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product' 
            },
            itemCount: Number,
            selectedSize: String
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {versionKey: false});

module.exports = mongoose.model('Cart', transformSchema(cartSchema));