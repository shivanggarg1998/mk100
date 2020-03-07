const Product = require('../models/product');
const Seller = require('../models/seller');
import {uploadsToS3} from '../middlewares/upload';

var _ = require('lodash');
import {createApprovalRequest, createFeedItem} from "./utils";

const normalizeKeywords = (keywords) => {
    // TODO : Implement it to normalize keywords entered by user.
    // Consult with Nikhil Pandey
    return keywords || [];
};

const lowerToTitle = (str) => {
    let res = str.split("");
    res[0] = res[0].toUpperCase();
    for (let i = 1; i < res.length; i++) {
        if (res[i] === " ") {
            res[i + 1] = res[i + 1].toUpperCase();
        }
    }
    res = res.join("");
    return res;
};

module.exports = {
    Query: {
        // TODO : Implement Pagination and Filters...
        // Consult with Apollo Client for Requirements
        allProducts: (parent, args, context, info) => {
            return Product.find({
                removed: false,
                'approval.approved': true
            }).populate('seller').exec().then(
                data => data
            );
        },

        Product: (parent, args, context, info) => {
            return Product.findById({
                _id: args.id,
                removed: false,
                'approval.approved': true
            }).populate('seller').exec().then(
                data => data
            );
        },


        getProductBySeller: (parent, args, {seller}, info) => {
            let id = args.id;
            if (seller) {
                id = seller.id;
            }

            return Product.find({
                seller: id,
                removed: false,
                'approval.approved': true
            }).populate('seller').exec().then(
                data => {
                    console.log(data);
                    return data;
                }
            );

        },

        getProducts: (parent, args, context, info) => {
            return Product.find({
                'approval.approved': true,
                removed: false
            }).populate('seller').exec().then(
                data => {
                    let temp = [];
                    for (let i of data) {
                        if (i.name.toLowerCase() == args.filter.toLowerCase()) {
                            temp.push(i);
                            data.splice(i, 1);
                            continue;
                        }
                    }
                    for (let i of data) {
                        if (i.name.toLowerCase().includes(args.filter.toLowerCase())) {
                            temp.push(i);
                            continue;
                        }
                        if (i.name.toLowerCase().includes(args.filter.toLowerCase())) {
                            temp.push(i);
                            continue;
                        }
                        for (let j in i.keywords) {
                            if (j.toLowerCase().includes(args.filter.toLowerCase())) {
                                temp.push(i);
                                break;
                            }
                        }
                    }
                    return temp;
                }
            );
        },

        getProductsByCategory: (parent, {input}, args, info) => {
            input.name = lowerToTitle(input.name);
            input.title = lowerToTitle(input.title);
            return Product.find({
                category: input,
                'approval.approved': true,
                removed: false
            }).exec().then(
                data => {
                    // console.log(data);
                    return data;
                }
            );
        }
    },

    Mutation: {
        addProduct: (parents, {
            input,
            ...args
        }, context, info) => {
            console.log(input, context.seller);
            if (!context.seller) {
                throw new Error("Seller Not Specified");
            }
            console.log(input);
            return uploadsToS3(input.images).then((data) => {
                input.image = data[0];
                input.images = data;
                return Product.create({
                    ...input,
                    keywords: normalizeKeywords(input.keywords),
                    seller: context.seller.id,
                    removed: false
                }).then(
                    createdProduct => {
                        // TODO : Add Verification Request to Admin.
                        createApprovalRequest('Product', createdProduct.id);
                        createFeedItem('Product', createdProduct.id, context.seller.id, 'Product is added');


                        return createdProduct.populate('seller').execPopulate().then(
                            data => ({
                                product: data.toJSON()
                            })
                        );
                    }
                );
            });

        },

        updateProduct: (parents, {
            input,
            ...args
        }, context, info) => {


            console.log("Update Seller : ", input);

            return uploadsToS3(input.images).then((data) => {
                // input.image = data[0];
                // input.images = data;
                delete input.images;

                return Product.findOneAndUpdate({
                    _id: input.productID
                }, {
                    $set: {
                        ...input,
                        keywords: normalizeKeywords(input.keywords),
                    },
                    $addToSet: {
                        images: data
                    }
                }, {
                    new: true
                }).populate('seller').exec().then(
                    foundProduct => ({
                        product: foundProduct.toJSON()
                    })
                );
            });
        },

        // set removed to true
        removeProduct: (parents, args, context, info) => {
            console.log(context);

            return Product.findOne({
                _id: args.productID
            }).exec().then(
                data => {
                    if (context.admin || data.seller == context.seller.id) {
                        data.removed = true;
                        data.save();
                        return true;
                    } else {
                        return false;
                    }
                }
            );
        }
    }
};