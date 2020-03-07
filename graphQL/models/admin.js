const mongoose = require('mongoose');
const transformSchema = require('./utils/schemaTransform');
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
    name: String,
    image: String,
    username: {
        type: String,
        unique: true
    },
    password: String,
}, {
    versionKey: false
});

adminSchema.pre('save', function (next) {
    let user = this;
    if (!user.isModified('password')) {
        return next();
    }
    let hash = bcrypt.hashSync(user.password);
    user.password = hash;
    next();
});

adminSchema.methods.comparePassword = function (password) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
};


module.exports = mongoose.model('Admin', transformSchema(adminSchema));