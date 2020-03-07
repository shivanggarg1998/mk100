const mongoose = require('mongoose');
const transformSchema = require('./utils/schemaTransform');

const addressSchema = new mongoose.Schema({
    address: String,
    street: String,
    city: String,
    state: String,
    zipcode: Number
}, {
    versionKey: false
});


module.exports = addressSchema
