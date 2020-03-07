const mongoose = require('mongoose');
const transformSchema = require('./utils/schemaTransform');

const notificationSchema = new mongoose.Schema({
    text: String,
    action: String,
    image: String,
    to: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    versionKey: false ,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
    
});

module.exports = mongoose.model('Notification', transformSchema(notificationSchema));