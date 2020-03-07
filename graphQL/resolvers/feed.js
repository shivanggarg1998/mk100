import {createNotificationForGroup} from "./utils";

const User = require('../models/user');
const Post = require('../models/post');
const Feed = require('../models/feed');
const Product = require('../models/product');
const Seller = require('../models/seller');
const Sellerpost = require('../models/sellerpost');
const UserPost = require('../models/post');
import config from '../config'

// TODO : Optimize Query and Sort According to Timestamp
// TODO : Add Support for Infinite Scroll

module.exports = {
    Query: {
        getFeed: (parent, args, context, info) => {

            return User.findOne({_id: context.user.id}).then(foundUser => {

                if (foundUser) {
                    let array1 = foundUser.following;
                    let array2 = foundUser.followers;
                    let array3 = foundUser.followingShop;

                    let searchKeys = array1.concat(array2).concat(array3);
                    // console.log(searchKeys);

                    return Feed.find({
                        key: {"$in": searchKeys}
                    }).populate('origin').sort('-updated_at').then(data => {
                        // console.log(data);

                        data = data.filter(
                            item => {
                                if (item.origin ===  null)
                                    console.log(item);
                                return item.origin !== null
                            }
                        );

                        data = data.map(item => {
                            item.origin.__typename = item.refString;
                            if (item.refString === 'Product') {
                                console.log("Product Feed");
                                return Seller.populate(item, {'path': 'origin.seller'});
                            }
                            if (item.refString === 'Sellerpost') {
                                console.log("Seller Post Feed");
                                item.origin.liked_by_me = (item.origin.liked_by.indexOf(context.user.id) > -1);
                                return Seller.populate(item, {'path': 'origin.seller'});
                            }
                            if (item.refString === 'UserPost') {
                                console.log("User Repost Feed");
                                return item.populate({path: 'origin.user', model: User})
                                    .populate({
                                        path: 'origin.product',
                                        model: Product,
                                        populate: {path: 'seller', model: Seller}
                                    }).execPopulate().then(_ => {
                                        // console.log(_);
                                        // _.origin.product.in_my_wishlist = true ;
                                        return _;
                                    });
                            }
                            return item;
                        });
                        return data;
                    });
                }
            });


        },
        getFeedItem: (parent, {id}, context, info) => {
            console.log(id);
            return Feed.findOne({
                _id: id
            }).populate('origin').sort('-updated_at').then(item => {
                // console.log(data);

                item.origin.__typename = item.refString;
                if (item.refString === 'Product') {
                    console.log("Product Feed");
                    return Seller.populate(item, {'path': 'origin.seller'});
                }
                if (item.refString === 'Sellerpost') {
                    console.log("Seller Post Feed");
                    item.origin.liked_by_me = (item.origin.liked_by.indexOf(context.user.id) > -1);
                    return Seller.populate(item, {'path': 'origin.seller'});
                }
                if (item.refString === 'UserPost') {
                    console.log("User Repost Feed");
                    return item.populate({path: 'origin.user', model: User})
                        .populate({
                            path: 'origin.product',
                            model: Product,
                            populate: {path: 'seller', model: Seller}
                        }).execPopulate().then(_ => {
                            return _;
                        });
                }
                return item;
            });
        },
    },
    Mutation: {
        addSellerPostLike: (parent, {input}, context, info) => {
            return Sellerpost.findOne({
                _id: input.post
            }).exec().then(post => {
                if (post.liked_by.indexOf(context.user.id) === -1) {
                    post.liked_by.push(context.user.id);
                }
                return post.save().then(data => {
                    console.log(data.liked_by);
                    data.liked_by_me = (data.liked_by.indexOf(context.user.id) > -1);
                    return data;
                });
            });
        },
        removeSellerPostLike: (parent, {input}, context, info) => {
            // console.log(input);
            return Sellerpost.findOne({
                _id: input.post
            }).exec().then(post => {
                // console.log(post);
                let index = post.liked_by.indexOf(context.user.id);
                if (index > -1) {
                    post.liked_by.splice(index, 1);
                }
                return post.save().then(data => {
                    console.log(data.liked_by);
                    data.liked_by_me = (data.liked_by.indexOf(context.user.id) > -1);
                    return data;
                });
            });
        },
        addSellerComment: (parent, {input}, context, info) => {
            return Sellerpost.findOne({
                _id: input.post
            }).exec().then(post => {
                post.comments.push({
                    text: input.comment,
                    user: context.user.id,
                    username: context.user.username,
                    mentions: input.mentions
                });
                return post.save().then(data => {
                    data.liked_by_me = (data.liked_by.indexOf(context.user.id) > -1);
                    createNotificationForGroup({
                        to: input.mentions,
                        text: `${context.user.name} mentioned you in a comment.`,
                        image: context.user.image,
                        action: `${config.client_url}/feed/${input.parentFeedId}`
                    });

                    return data;
                });
            });
        },
        // addUserPostLike: (parent, {input}, context, info) => {
        //     return UserPost.findOne({
        //         _id: input.post
        //     }).exec().then(post => {
        //         if (post.liked_by.indexOf(context.user.id) === -1) {
        //             post.liked_by.push(context.user.id);
        //         }
        //         return post.save().then(data => {
        //             console.log(data.liked_by);
        //             data.liked_by_me = (data.liked_by.indexOf(context.user.id) > -1);
        //             return data.populate('origin.user').populate('origin.seller').execPopulate().then(data => data);
        //         });
        //     });
        // },
        // removeUserPostLike: (parent, {input}, context, info) => {
        //     // console.log(input);
        //     return User.findOne({
        //         _id: input.post
        //     }).exec().then(post => {
        //         // console.log(post);
        //         let index = post.liked_by.indexOf(context.user.id);
        //         if (index > -1) {
        //             post.liked_by.splice(index, 1);
        //         }
        //         return post.save().then(data => {
        //             console.log(data.liked_by);
        //             data.liked_by_me = (data.liked_by.indexOf(context.user.id) > -1);
        //             return data.populate('origin.user').populate('origin.seller').execPopulate().then(data => data);
        //
        //         });
        //     });
        // },
        addUserPostComment: (parent, {input}, context, info) => {
            return UserPost.findOne({
                _id: input.post
            }).exec().then(post => {
                post.comments.push({
                    text: input.comment,
                    user: context.user.id,
                    username: context.user.username,
                    mentions: input.mention
                });
                return post.save().then(data => {
                    createNotificationForGroup({
                        to: input.mentions,
                        text: `${context.user.name} mentioned you in a comment.`,
                        image: context.user.image,
                        action: `/feed/${input.parentFeedId}`
                    });
                    return data.populate('user').populate('seller').execPopulate().then(data => data);
                });
            });
        }
    }
};

