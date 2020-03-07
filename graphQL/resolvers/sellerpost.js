import Sellerpost from '../models/sellerpost';
import Feed from '../models/feed';
import Seller from '../models/seller';
import {
    createFeedItem,
    createNotificationSellerpost
} from "./utils";
import {
    uploadToS3
} from '../middlewares/upload';

module.exports = {
    Query: {
        allSellerpost: (parent, args, context, info) => {
            return Sellerpost.find()
                .populate({
                    path: 'product',
                    populate: {
                        path: 'seller'
                    }
                })
                .populate('seller')
                .populate('comments.user')
                .exec()
                .then(data => {
                    // console.log(data);
                    return data;
                });
        },
        getSellerPostByID: (parent, args, {
            seller
        }, info) => {
            return Sellerpost.findById(args.id).exec().then(
                data => {
                    console.log(data);
                    return data;
                }
            );
        },
        getSellerPostBySeller: (parent, args, {
            seller
        }, info) => {
            let id = args.id;
            if (seller) {
                id = seller.id;
            }

            return Sellerpost.find({
                seller: id
            })
                .populate({
                    path: 'comments.user',
                })
                .populate('seller')
                .sort('-created_at')
                .exec()
                .then(
                    data => {
                        console.log(data.length);
                        return data;
                    }
                );
        },

        getSellerPostByFeed: (parent, args, context, info) => {
            let seller = args.id;

            return Feed.find({
                key: seller,
                refString: 'Sellerpost'
            }).populate('origin').sort('-updated_at').then(data => {
                data = data.map(item => {
                    item.origin.__typename = item.refString;

                    if (item.refString === 'Sellerpost') {
                        console.log("Seller Post Feed");
                        item.origin.liked_by_me = (item.origin.liked_by.indexOf(context.user.id) > -1);
                        return Seller.populate(item, {
                            'path': 'origin.seller'
                        });
                    }
                    return item;
                });
                return data;
            });


        }
    },


    Mutation: {
        addNewPostSeller: (parent, {file, caption}, {seller}, info) => {
            let image;
            return file.then((data) => {
                const {
                    stream,
                    filename,
                    mimetype,
                    encoding
                } = data;
                return uploadToS3(filename, stream, false).then((dataurl) => {
                    image = dataurl;
                    console.log("caption", caption);
                    seller.id = seller.id;
                    return Sellerpost.create({
                        seller: seller.id,
                        caption: caption,
                        image: image
                    }).then(
                        createdPost => {
                            return createdPost
                                .populate('seller')
                                .execPopulate()
                                .then(data => {
                                    createFeedItem('Sellerpost', createdPost.id, createdPost.seller, 'Seller Post is added', data);
                                    console.log(data);
                                    return data;
                                });
                        }
                    );
                });
            });
        },
        updatePostSeller: (parent, {file, caption, id}, {seller}, info) => {
            let image;
            console.log(file);
            if (file == '' || !file) {
                return Sellerpost.findByIdAndUpdate(id, {
                    seller: seller.id,
                    caption: caption,
                }).then(
                    createdPost => {
                        return createdPost
                            .populate('seller')
                            .execPopulate()
                            .then(data => {
                                //createFeedItem('Sellerpost', createdPost.id, createdPost.seller, 'Seller Post is added',data);
                                console.log(data);
                                return data;
                            });
                    }
                );
            } else {
                file.then((data) => {
                    const {
                        stream,
                        filename,
                        mimetype,
                        encoding
                    } = data;
                    uploadToS3(filename, stream, false).then((dataurl) => {
                        image = dataurl;
                        console.log("caption", caption);
                        seller.id = seller.id;
                        return Sellerpost.findByIdAndUpdate(id, {
                            seller: seller.id,
                            caption: caption,
                            image: image
                        }).then(
                            createdPost => {
                                return createdPost
                                    .populate('seller')
                                    .execPopulate()
                                    .then(data => {
                                        //createFeedItem('Sellerpost', createdPost.id, createdPost.seller, 'Seller Post is added',data);
                                        console.log(data);
                                        return data;
                                    });
                            }
                        );
                    });
                });
            }

        },
        removeSellerPost: (parent, {
            id
        }, {
                               seller
                           }, info) => {
            return Sellerpost.findOneAndRemove({
                _id: id
            }).then(
                data => {
                    if (data.seller == seller.id) {
                        console.log("Deleting Sellerpost");
                        data.remove();
                        return true;
                    } else {
                        return false;
                    }
                }
            );
        }
    }
};