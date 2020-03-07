import UserPost from '../models/post';
import User from '../models/user';
import {createFeedItem} from "./utils";

module.exports = {
    Query: {
        getUserPosts: (parent, args, context, info) => {
            return UserPost.find()
                .populate({
                    path: 'product',
                    populate: {
                        path: 'seller'
                    }
                })
                .populate('user')
                .exec()
                .then(data => {
                    // console.log(data);
                    return data;
                });
        },
        UserPosts: (parent, {username}, context, info) => {
            return User.findOne({username: username}).exec().then(
                foundUser => {
                    return UserPost.find({user: foundUser._id})
                        .populate({
                            path: 'product',
                            populate: {
                                path: 'seller'
                            }
                        })
                        .populate('user')
                        .exec()
                        .then(
                            data => {
                                // console.log(data);
                                return data;
                            }
                        );
                }
            );
        }
    },
    Mutation: {
        addUserPost: (parent, {input}, context, info) => {

            return UserPost.create({
                product: input.product,
                user: context.user.id,
                caption: input.caption
            }).then(
                createdUserPost => {
                    createFeedItem('UserPost', createdUserPost.id, createdUserPost.user, 'UserPost is added');
                    return createdUserPost
                        .populate({
                            path: 'product',
                            populate: {
                                path: 'seller'
                            }
                        })
                        .populate('user')
                        .execPopulate()
                        .then(
                            data => {
                                // console.log(data);
                                return data;
                            }
                        );
                }
            );
        },
        updateUserPost: (parent, {input}, context, info) => {
            let {postID, caption} = input;

            return UserPost.findOneAndUpdate(
                {_id: postID},
                {$set: {caption: caption}},
                {new: true}
            ).exec().then(
                data => {
                    // console.log(data);
                    return data;
                }
            )
        },

        deleteUserPost: (parent, {postID}, context, info) => {
            return UserPost.findOneAndRemove(
                {_id: postID}
            ).exec().then(
                data => !!data
            )
        }
    }
};