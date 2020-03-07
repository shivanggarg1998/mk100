import Approval from '../models/approval';
import Product from '../models/product';
import Seller from '../models/seller';
import {createNotificationProduct, sendEmailToSellerApproval} from './utils';

module.exports = {
    Query: {
        getProductApproval: (parent, args, context, info) => {
            return Approval.find({"approvalType": "Product", "reviewed": false}).populate({
                path: 'origin',
                populate: {
                    path: 'seller'
                }
            }).exec().then(
                foundApproval => foundApproval
            );
        },
        getSellerApproval: (parent, args, context, info) => {
            return Approval.find({"approvalType": "Seller", "reviewed": false}).populate('origin').exec().then(
                foundApproval => foundApproval
            );
        }
    },
    Mutation: {
        handleApproval: (parent, {input}, context, info) => {
            let {id, comment, approved} = input;
            return Approval.findOneAndUpdate(
                {_id: id},
                {
                    $set: {
                        comment: comment,
                        approved: approved,
                        reviewed: true
                    }
                },
                {new: true}
            ).then(
                updatedApproval => {
                    const refString = updatedApproval.refString;
                    console.log(updatedApproval);

                    if (refString === 'Product') {
                        Product.findOne({_id: updatedApproval.origin}).exec().then(
                            foundProduct => {
                                foundProduct.approval = {
                                    approved: updatedApproval.approved,
                                    reviewed: true,
                                    comment: updatedApproval.comment
                                };
                                return foundProduct.save().then(data => {
                                    createNotificationProduct(foundProduct);
                                    return foundProduct;
                                });
                            }
                        )
                    } else {
                        Seller.findOne({_id: updatedApproval.origin}).exec().then(
                            foundSeller => {
                                foundSeller.approval = {
                                    approved: updatedApproval.approved,
                                    comment: updatedApproval.comment,
                                    reviewed:true,
                                };
                                return foundSeller.save().then(
                                    seller => {
                                        console.log(seller);
                                        sendEmailToSellerApproval(seller._id);
                                        return foundSeller
                                    }
                                );
                            }
                        )
                    }
                    return !!updatedApproval;
                }
            );
        }
    }
};