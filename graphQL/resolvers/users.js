const User = require('../models/user');
const axios = require('axios');
const Seller = require('../models/seller');
const _ = require('lodash');
import {
    createdNotificationFollow
} from './utils';
import {
    uploadToS3
} from '../middlewares/upload'

module.exports = {
    Query: {
        allUsers: (parent, args, context, info) => {
            //console.log(context.seller);
            return User.find({})
                .populate('address')
                .populate('following')
                .populate('followers')
                .populate('followingShop')
                .populate('followNotify.User')
                .exec();
        },
        User: (parent, args, context, info) => {
            return User.findOne({
                username: args.username
            })
                .populate('address')
                .populate('followers')
                .populate('following')
                .populate('followingShop')
                .populate('followNotify.User')
                .exec();
        },
        checkUserNameAvailability: (parent, args, context, info) => {
            return User.findOne({
                username: args.username
            }).then(data => {
                if (data) {
                    return false;
                }
                return true;
            });
        },
        getUserAddresses: (parent, args, context, info) => {
            let userId = context.user.id;
            return User.findOne({
                _id: userId
            }).then(foundUser => {
                //console.log(foundUser.address);
                return foundUser.address;
            });
        },
        searchUsers: (parent, args, context, info) => {
            let queryString = args.query;
            let regex = new RegExp("^" + queryString, 'i');
            return User.find({
                username: regex
            }, 'username name id image about').limit(5).then(data => {
                //console.log(data);
                return data;
            });
        },

        searchUsersAndSellers: (parent, {
            query
        }, context, info) => {
            let regex = new RegExp("^" + query, 'i');
            return User.find({
                username: regex
            }).limit(5).then(userResults => {
                //console.log(data);
                return Seller.find({
                    shopName: regex
                }).limit(5).then(sellerResults => {
                    return {
                        sellers: sellerResults,
                        users: userResults
                    };
                })

            });
        },

        getFollower: (parent, { username }, { user }, info) => {
            return User.findOne({
                username: username
            })
                .populate('followers')
                .exec()
                .then(
                    foundUser => foundUser.followers
                );
        },

        getFollowing: (parent, { username }, { user }, info) => {
            return User.findOne({
                username: username
            })
                .populate('following')
                .exec()
                .then(
                    foundUser => foundUser.following
                );
        }
    },

    Mutation: {
        addUserAddress: (parents, args, context, info) => {
            //console.log()
            return User.findOneAndUpdate({
                _id: context.user.id
            }, {
                $addToSet: {
                    address: args.input.address
                }

            }, {
                new: true
            }).exec()
                .then(data => {
                    //console.log(data);
                    return data.address[data.address.length - 1];
                });

        },

        followUser: (parents, args, context, info) => {
            return User.findOneAndUpdate({
                _id: context.user.id
            }, {
                $addToSet: {
                    following: args.FollowingID
                }

            })
                .populate('following')
                .exec()
                .then(
                    (data) => {
                        return User.findOneAndUpdate({
                            _id: args.FollowingID
                        }, {
                            $addToSet: {
                                followers: context.user.id
                            }
                        })
                            .populate('followers')
                            .exec()
                            .then(
                                info => {
                                    createdNotificationFollow(data, info);
                                    return info;
                                }
                            );
                    }
                );
        },
        unFollowUser: (parents, args, context, info) => {
            return User.findOneAndUpdate({
                _id: context.user.id
            }, {
                $pull: {
                    following: args.FollowingID
                }

            }).populate('following').exec().then((data) => {
                return User.findOneAndUpdate({
                    _id: args.FollowingID
                }, {
                    $pull: {
                        followers: context.user.id
                    }
                })
                    .populate('followers')
                    .exec()
                    .then(
                        data => {
                            return data;
                        }
                    );
            });
        },
        followShop: (parents, args, context, info) => {
            return User.findOneAndUpdate({
                _id: context.user.id
            }, {
                $addToSet: {
                    followingShop: args.FollowingID
                }

            }).populate('followingShop').exec().then((data) => {
                return Seller.findOneAndUpdate({
                    _id: args.FollowingID
                }, {
                    $addToSet: {
                        followers: context.user.id
                    }
                }).populate('followers').exec().then(data => data);
            });
        },
        unFollowShop: (parents, args, context, info) => {
            return User.findOneAndUpdate({
                _id: context.user.id
            }, {
                $pull: {
                    followingShop: args.FollowingID
                }

            }).populate('followingShop').exec().then((data) => {
                return Seller.findOneAndUpdate({
                    _id: args.FollowingID
                }, {
                    $pull: {
                        followers: context.user.id
                    }
                }).populate('followers').exec().then(data => data);
            });
        },
        Notify: (parents, args, context, info) => {
            return User.findOne({
                email: args.Email
            }).exec().then((user) => {
                //console.log(context.user);
                user.UserToken = args.UserToken;
                //console.log(user.UserToken);
                user.save();

            });

        },

        updateUser: (parent, {
            input
        }, {
            user
        }, info) => {
            let {
                name,
                image,
                about
            } = input;
            return User.findOneAndUpdate({
                _id: user.id
            }, {
                $set: {
                    name: name,
                    about: about
                }
            }, {
                returnNewDocument: true
            }).exec().then(
                updatedUser => {
                    //console.log(updatedUser);
                    return updatedUser;
                }
            )

        },


        changeProfileVisibility: (parent, {
            public: isProfilePublic
        }, {
            user
        }, info) => {
            return User.findOneAndUpdate({
                _id: user.id
            }, {
                $set: {
                    public: isProfilePublic
                }
            }, {
                new: true
            }).exec().then(
                updatedUser => {
                    //console.log(updatedUser.public);
                    return !!updatedUser
                }
            )
        }

    }
};