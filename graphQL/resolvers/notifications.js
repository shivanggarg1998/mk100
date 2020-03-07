const Notification = require('../models/notification');
const User = require('../models/user');
const Seller = require('../models/seller');

module.exports = {
    Query: {
        allNotifs: (parent, args, context, info) => {
            return Notification
                .find()
                .populate('to')
                .populate('readBy')
                .exec()
                .then(
                    data => data
                );
        },
        getNotifsByUser: (parent, args, {
            user
        }, info) => {
            return Notification
                .find({
                    "to": user.id
                })
                .populate('to')
                .populate('readBy')
                .sort('-created_at')
                .limit(10)
                .exec()
                .then(
                    data => data
                );
        },
        getNotificationsBySeller: (parent, args, {
            seller
        }, info) => {
            return Notification
                .find({
                    to: seller.id
                })
                .populate({
                    path: 'to',
                    model: Seller
                })
                .populate({
                    path: 'readBy',
                    model: Seller
                })
                .sort('-created_at')
                .limit(10)
                .exec()
                .then(
                    data => data
                );
        },
        getNotifsForAdmin: (parent, args, context, info) => {
            return Notification
                .find({
                    to: []
                })
                .sort('-created_at')
                .limit(10)
                .exec()
                .then(
                    data => data
                );
        }
    },
    Mutation: {
        notificationRead: (parent, {
            id
        }, {
            user,
            seller
        }, info) => {

            // Makes it Suitable for Seller Too.
            if (!user) {
                user = seller;
            }

            return Notification
                .findOne({
                    _id: id
                })
                .exec()
                .then(
                    foundNotif => {
                        if (!foundNotif.readBy.includes(user.id)) {
                            foundNotif.readBy.push(user.id);
                            foundNotif.save();
                        }
                        return foundNotif;
                    }
                );
        },
        makeChatNotify: (parent, {
            to
        }, {
            user
        }, info) => {
            return User.findOne({
                username: to
            }).then(users => {

                Notification.findOne({
                    "text": {
                        "$regex": user.username
                    },
                    "to": users.id,
                    "action": '/chat'
                }).exec().then(
                    foundNotif => {
                        if (foundNotif == null) {
                            var temp = new Notification({
                                "text": "1 unread chat from " + user.username,
                                "to": users.id,
                                "action": '/chat',
                                "image": user.image
                            });
                            temp.save();
                        } else {
                            var noOfChat = parseInt(foundNotif.text, 10);
                            noOfChat++;
                            foundNotif.text = noOfChat + " unread chat from " + user.username;
                            foundNotif.save();
                        }
                    }
                );
            });
        },
        makeChatNotifyToSeller: (parent, {
            to
        }, {
            user
        }, info) => {
            return Seller.findOne({
                shopName : to
            }).then(seller => {
                console.log('user',to)
                return Notification.findOne({
                    "text": {
                        "$regex": user.username
                    },
                    "to": seller.id,
                    "action": '/chat'
                }).exec().then(
                    foundNotif => {
                        if (foundNotif == null) {
                            var temp = new Notification({
                                "text": "1 unread chat from " + user.username,
                                "to": seller.id,
                                "action": '/chat',
                                "image": user.image
                            });
                            console.log('sucess',temp.text);
                            temp.save();
                        } else {
                            var noOfChat = parseInt(foundNotif.text, 10);
                            noOfChat++;
                            foundNotif.text = noOfChat + " unread chat from " + user.username;
                            console.log('sucess',foundNotif.text);
                            foundNotif.save();
                        }
                    }
                );
            });
        },
        makeChatNotifyFromSeller: (parent, {
            to
        }, {
            seller
        }, info) => {
            return User.findOne({
                username: to
            }).then(users => {

                Notification.findOne({
                    "text": {
                        "$regex": seller.shopName
                    },
                    "to": users.id,
                    "action": '/chat'
                }).exec().then(
                    foundNotif => {
                        if (foundNotif == null) {
                            var temp = new Notification({
                                "text": "1 unread chat from " + seller.shopName,
                                "to": users.id,
                                "action": '/chat',
                                "image": seller.image
                            });
                            temp.save();
                        } else {
                            var noOfChat = parseInt(foundNotif.text, 10);
                            noOfChat++;
                            foundNotif.text = noOfChat + " unread chat from " + seller.shopName;
                            foundNotif.save();
                        }
                    }
                );
            });
        }
    }
};