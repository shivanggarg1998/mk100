const mongoose = require('mongoose');
const transformSchema = require('./utils/schemaTransform');

const ApprovalSchema = new mongoose.Schema({
        approvalType: {
            type: String,
        },
        approved: {
            type: Boolean,
            default: false
        },
        reviewed : {
            type : Boolean ,
            default: false
        } ,
        comment : String ,
        origin: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'refString'
        },
        refString: String, // enum [ 'Seller' , 'Product']
    },
    {
        versionKey: false,
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

export default mongoose.model('Approval', transformSchema(ApprovalSchema));