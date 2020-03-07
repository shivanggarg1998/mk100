const mongoose = require('mongoose');
const transformSchema = require('./utils/schemaTransform');
import Address from './address';

const orderSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            seller: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Seller'
            },
            itemCount: Number,
            selectedSize: String,
            shipping: {
                refid : String ,
                // To Store Any Response From VamaShip.
                response : {} ,
                input : {} ,
            },
            return : {
                refid : String ,
                // To Store Any Response From VamaShip.
                response : {} ,
                input : {} ,
            } ,
            status: {
                confirmed: {type: Boolean, default: false},
                shipped: {type: Boolean, default: false},
                delivered: {type: Boolean, default: false},
                returned: {type: Boolean, default: false},
                refunded: {type: Boolean, default: false},
            }
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    order_number: {
        type: String,
        index: true
    },
    discount: Number,
    total: Number,
    date: Date,
    shipping: {
        status: String,
        address: Address
    },
    payment: {
        status: String,
        mode: String,
        response: {}
    },
    status: {
        confirmed: {type: Boolean, default: false},
    }

}, {
    versionKey: false, timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('Order', transformSchema(orderSchema));