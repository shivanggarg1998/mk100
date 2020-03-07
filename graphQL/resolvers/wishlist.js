const Wishlist = require('../models/wishlist');
const User = require('../models/user');

module.exports = {
    Query: {
        showWishlist: (parent, args, context, info) => {
            const userID = args.user;
            const signedInUser = context.user.id;

            // userID -> nil means wishlist route
            if (userID === "nil" || userID == signedInUser) {
                return Wishlist.findOne({user: signedInUser})
                    .populate({
                        path: 'products',
                        populate: {
                            path: 'seller'
                        }
                    })
                    .populate('user')
                    .exec();

            } else {
                return User.findOne({_id: userID}).then(
                    foundUser => {
                        if (foundUser.followers.includes(signedInUser))
                            return Wishlist.findOne({user: userID})
                                .populate({
                                    path: 'products',
                                    populate: {
                                        path: 'seller'
                                    }
                                })
                                .populate('user')
                                .exec();
                    }
                );
            }
            return [];
        },
        checkInWishlist: (parent, {product}, context, info) => {
            const userID = context.user.id;
            return Wishlist.findOne({user: userID}).then(
                foundWishlist => {
                    if (!foundWishlist) {
                        return false;
                    } else {
                        return foundWishlist.products.find(
                            item => item == product
                        );
                    }
                }
            );
        }
    },
    Mutation: {
        addToWishlist: (parent, {product}, context, info) => {
            const userID = context.user.id;

            return Wishlist.findOne({user: userID}).exec().then(
                foundWishlist => {
                    if (!foundWishlist) {
                        return Wishlist.create({
                            user: userID,
                        }).then(
                            createdWishlist => {
                                createdWishlist.products.push(product);
                                createdWishlist.save();
                                return createdWishlist
                                    .populate({
                                        path: 'products',
                                        populate: {
                                            path: 'seller'
                                        }
                                    })
                                    .populate('user')
                                    .execPopulate()
                                    .then(data => data.toJSON());
                            }
                        );
                    } else {
                        if (foundWishlist.products.indexOf(product) === -1) {
                            foundWishlist.products.push(product);
                        }
                        foundWishlist.save();
                        return foundWishlist
                            .populate({
                                path: 'products',
                                populate: {
                                    path: 'seller'
                                }
                            })
                            .populate('user')
                            .execPopulate()
                            .then(data => data.toJSON());
                    }
                }
            );
        },
        removeFromWishlist: (parent, {product}, context, info) => {
            const userID = context.user.id;
            console.log("REMOVE FROM WISH LIST", userID, product);
            return Wishlist.findOne({user: userID}).exec().then(
                foundWishlist => {
                    foundWishlist.products = foundWishlist.products.filter(
                        item => item != product
                    );

                    foundWishlist.save();
                    return foundWishlist
                        .populate({
                            path: 'products',
                            populate: {
                                path: 'seller'
                            }
                        })
                        .populate('user')
                        .execPopulate()
                        .then(data => data.toJSON());
                }
            );
        }
    }
};