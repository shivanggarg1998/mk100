const mongoose = require('mongoose');
const transformSchema = require('./utils/schemaTransform');

const GlobalnotificationSchema = new mongoose.Schema({
    text: String,
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    versionKey: false
});

module.exports = mongoose.model('GlobalNotification', transformSchema(GlobalnotificationSchema));