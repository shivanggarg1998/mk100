const mongoose = require('mongoose');
const transformSchema = require('./utils/schemaTransform');
import bcrypt from 'bcryptjs';
import Address from './address';

const sellerSchema = new mongoose.Schema({
    name: String,
    image: {
        type: String,
        default: "https://i.stack.imgur.com/l60Hf.png"
    },

    shopName: {
        type: String,
        unique: true
    },
    password: String,
    // Used for Auth
    approval: {
        approved: {
            type: Boolean,
            default: false
        },
        reviewed: {
            type: Boolean,
            default: false
        },
        comment: String
    },
    email : String ,
    mobile : String,

    intro: String,
    about: String,

    address: [Address],
    website: String,
    
    legal: {
        aadhar: String,
        aadhar_image_front:String,
        aadhar_image_back:String,
        pan: String,
        pan_image:String,
        cancelled_cheque:String,
        gst: String,
        gst_document:String,
        bank: {
            name: String,
            accountNumber: String,
            ifscCode: String
        }
    },
    policy: {
        store: String,
        return: String
    },
    followers: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }] ,
        default : []
    },
}, {
    versionKey: false
});

sellerSchema.pre('save', function (next) {
    let user = this;
    if (!user.isModified('password')) {
        return next();
    }
    let hash = bcrypt.hashSync(user.password);
    user.password = hash;
    next();
});

sellerSchema.methods.comparePassword = function (password) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
};


module.exports = mongoose.model('Seller', transformSchema(sellerSchema));