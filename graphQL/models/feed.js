const mongoose = require('mongoose');
const transformSchema = require('./utils/schemaTransform');

const FeedSchema = new mongoose.Schema({
        event: String,
        origin: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'refString'
        },
        key : {
            type : mongoose.Schema.Types.ObjectId,
        },
        refString: String, // enum [ 'Post' , 'Sellerpost' , 'Product']
    },
    {
        versionKey: false,
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);


module.exports = mongoose.model('Feed', transformSchema(FeedSchema));