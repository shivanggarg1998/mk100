const Product = require('../models/product');
const Address = require('../models/address');
const Seller = require('../models/seller');
const Sellerpost = require('../models/sellerpost');
const bcrypt = require('bcryptjs');
import jwt from 'jsonwebtoken';
import config from '../config';
import {
    createApprovalRequest,
    sendSMSTo,
    sendEmailTo
} from "./utils";
import {
    uploadsToS3,
    uploadToS3
} from '../middlewares/upload';

const ADMIN_EMAIL_ADDRESS = "connect@frnzy.in";

const notifyUser = (tempPassword, seller) => {
    sendSMSTo(
        `Hello Seller, your temporary password is ${tempPassword}. Kindly use it to log into your account and change it. Regards, Team FRNZY`,
        seller.mobile
    );

    sendEmailTo(
        "Password Reset",
        `
            <p>Hello, ${seller.name}</p>
            <p>
                You have requested for a new password for your account on FRNZY. 
                Your temporary password is ${tempPassword}. Kindly log into your account and change the password.
                If you did not request for a new password, please let us know immediately by replying to this email.
            </p>
            <p>
                Yours,
                <strong>MK100</strong>
            </p>
        `,
        seller.email
    );
};

function compare(a, b) {
    if (a.followers.length > b.followers.length)
        return -1;
    if (a.followers.length < b.followers.length)
        return 1;
    return 0;
}

module.exports = {
    Query: {
        allSellers: (parent, args, context, info) => {
            return Seller.find({}).populate('followers').exec().then(
                data => data
            );
        },

        Seller: (parent, {shopName}, context, info) => {
            return Seller.findOne({
                "shopName": shopName
            }).populate('followers').exec().then(
                data => {
                    console.log(data);
                    return data;
                }
            );
        },

        getSeller: (parent, args, {seller}, info) => {
            return Seller.findOne({
                "_id": seller.id
            }).populate('followers').exec().then(
                data => {
                    console.log(data);
                    return data;
                }
            );
        },

        getSellers: (parent, args, context, info) => {
            return Seller.find({
                '_id': {
                    $in: args.ids
                }
            }).populate('followers').exec().then(data => data);
        },

        checkShopnameAvailability: (parent, {shopName}, context, info) => {
            return Seller.findOne({
                shopName: shopName
            }).exec().then(
                data => !data
            );
        },
        checkEmailAvailability: (patent, {email}, context, info) => {
            return Seller.findOne({
                email: email
            }).exec().then(
                data => !data
            );
        },
        getSellerAddress: (parent, args, {seller}, info) => {
            return Seller.findOne({
                _id: seller.id
            }).then(
                data => {
                    // console.log(data);
                    return data.address;
                }
            );
        },

        getTopSellers: (parent, args, input, info) => {
            return Seller.find().exec()
                .then(
                    data => {
                        // console.log(data);
                        data.sort(compare);
                        data.splice(10);
                        return data;
                    }
                );
        },

        getSellerStats: (parent, args, {seller}, info) => {
            return Seller.findOne({
                _id: seller.id
            }).then(
                data => {
                    return Product.find({
                        seller: data._id,
                        removed: false,
                        'approval.approved': true,
                        'approval.reviewed': true
                    }).then(
                        res => {
                            return Sellerpost.find({
                                seller: data._id
                            }).then(
                                resp => {
                                    return {
                                        followers: data.followers.length,
                                        products: res.length,
                                        posts: resp.length
                                    };
                                }
                            );
                        }
                    );
                }
            );
        },

        getSellerFollowers: (parent, args, {seller}, info) => {
            return Seller.findOne({
                _id: seller.id
            })
                .populate('followers')
                .exec()
                .then(
                    data => data.followers
                );
        }
    },

    Mutation: {
        addSeller: (parents, {
            input
        }, context, info) => {
            // console.log('hello');
            // console.log(input.legal);
            console.log(input);

            let {
                address
            } = input;

            // let new_input = {};
            // new_input = input;

            delete input.address;

            // return uploadsToS3([input.legal.aadhar_image_front, input.legal.aadhar_image_back, input.legal.pan_image, input.legal.cancelled_cheque, input.image, input.legal.gst_document]).then((data) => {
            //     console.log(data);
            //     new_input.legal.aadhar_image_front = data[0];
            //     new_input.legal.aadhar_image_back = data[1];
            //     new_input.legal.pan_image = data[2];
            //     new_input.legal.cancelled_cheque = data[3];
            //     new_input.image = data[4];
            //     new_input.legal.gst_document = data[5];

            //     // console.log("Uploaded Input",input);
            //     // console.log("New Input", new_input);

            return Seller.create({
                ...input
            }).then(
                createdSeller => {
                    createdSeller.address = [{
                        address: address.address,
                        street: address.street,
                        city: address.city,
                        state: address.state,
                        zipcode: address.zipcode
                    }];
                    createdSeller.save();
                    createApprovalRequest('Seller', createdSeller.id);
                    console.log(createdSeller);
                    return createdSeller;
                }
            );
        },

        // Modify update seller to update address
        updateSeller: (parents, {input}, {seller}, info) => {

            let {name, image, about, intro, mobile} = input;
            // console.log("image", image);
            if (image == '') {
                return Seller.findOneAndUpdate({
                    _id: seller.id
                }, {
                    $set: {
                        name: name,
                        about: about,
                        intro: intro,
                        mobile: mobile
                    }
                }, {
                    new: true
                }).exec().then(
                    updatedUser => {
                        console.log(updatedUser);
                        return updatedUser;
                    }
                );
            } else {
                return image.then(data => {
                    const {
                        stream,
                        filename,
                        mimetype,
                        encoding
                    } = data;
                    return uploadToS3(filename, stream, false).then((dataurl) => {
                        image = dataurl;
                        return Seller.findOneAndUpdate({
                            _id: seller.id
                        }, {
                            $set: {
                                name: name,
                                image: image,
                                about: about,
                                intro: intro,
                                mobile: mobile
                            }
                        }, {
                            new: true
                        }).exec().then(
                            updatedUser => {
                                console.log(updatedUser);
                                return updatedUser;
                            }
                        );
                    });
                });
            }
        },

        removeSeller: (parents, args, context, info) => {
            return Seller.findOneAndDelete({
                _id: args.sellerID
            }).exec().then(
                data => data
            );
        },

        SellerLogin: (parent, {
            input
        }, context, info) => {
            console.log(input);
            let {
                shopName,
                password
            } = input;

            return Seller.findOne({
                shopName
            }).exec()
                .then(
                    foundSeller => {
                        if (foundSeller && foundSeller.approval.approved) {
                            // const passwordIsValid = foundSeller.comparePassword(password);
                            console.log("Logging In", foundSeller.password);
                            // console.log(password);
                            // console.log(foundSeller.password);
                            console.log("Logging In With", password);
                            console.log("IS valid", bcrypt.compareSync(password, foundSeller.password));
                            const passwordIsValid = bcrypt.compareSync(password, foundSeller.password);
                            if (!passwordIsValid) {
                                return {
                                    token: {
                                        code: 3,
                                        content: "The entered password is incorrect"
                                    }
                                };
                            } else {
                                const token = jwt.sign({
                                        id: foundSeller._id,
                                        name: foundSeller.name,
                                        image: foundSeller.image,
                                        about: foundSeller.about,
                                        shopName: foundSeller.shopName,
                                        seller: true
                                    },
                                    config.secret, {
                                        expiresIn: 60 * 60 * 24 * 7
                                    }
                                );
                                return {
                                    token: {
                                        code: 1,
                                        content: token
                                    }
                                };
                            }
                        } else {
                            return {
                                token: {
                                    code: 4,
                                    content: "The entered Shop Username was not found"
                                }
                            };
                        }
                    }
                );
        },

        unapprovedUpdate: (parent, {input}, context, info) => {
            console.log("Unapproved Input", input);
            // let {name, shopName, image, about, mobile, intro, address, legal, policy, website} = input;
            // let {pan, pan_image, aadhar, aadhar_image_back, aadhar_image_front, gst, gst_document, cancelled_cheque, bank} = legal;
            // let store = policy.store, returnPolicy = policy.return;
            // let bankName = bank.name;
            // let {accountNumber, ifscCode} = bank;

            let address = input.address;
            delete input.address;

            return Seller.findOneAndUpdate(
                {shopName: input.shopName},
                {
                    $set: {
                        ...input
                    }
                },
                {new: true}
            ).then(
                updatedSeller => {
                    if (updatedSeller) {
                        updatedSeller.address = [{
                            address: address.address,
                            street: address.street,
                            city: address.city,
                            state: address.state,
                            zipcode: address.zipcode
                        }];

                        return updatedSeller.save().then(
                            seller => {
                                console.log("Updated Seller", seller);
                                createApprovalRequest('Seller', seller._id);
                                return seller;
                            }
                        );

                    } else {
                        return null;
                    }
                }
            );

            // let images = [
            //     image,
            //     pan_image,
            //     aadhar_image_back,
            //     aadhar_image_front,
            //     gst_document,
            //     cancelled_cheque
            // ];

            // let tot = 0;

            // images.map(
            //     data => {
            //         if (data) tot++;
            //     }
            // );

            // if (tot > 0) {
            //     const uploadData = new Promise(
            //         (resolve, reject) => {
            //             let count = 0;
            //             for (let i = 0; i < 6; i++) {

            //                 if (images[i] === undefined) ;
            //                 else {
            //                     images[i].then(
            //                         data => {
            //                             const {stream, filename} = data;

            //                             uploadToS3(filename, stream, false).then(
            //                                 dataurl => {
            //                                     images[i] = dataurl;
            //                                     count++;
            //                                     if (count === tot)
            //                                         resolve("DONE");
            //                                 }
            //                             );
            //                         }
            //                     );
            //                 }
            //             }

            //         }
            //     );

            //     return uploadData.then(
            //         data => {
            //             console.log(data);
            //             console.log(images);

            //             return Seller.findOneAndUpdate(
            //                 {shopName: shopName},
            //                 {
            //                     $set: {
            //                         name: name,
            //                         about: about,
            //                         mobile: mobile,
            //                         intro: intro,
            //                         website: website
            //                     }
            //                 },
            //                 {new: true}
            //             ).then(
            //                 updatedSeller => {

            //                     updatedSeller.address = [{
            //                         ...address
            //                     }];

            //                     updatedSeller.policy = {
            //                         store: store,
            //                         return: returnPolicy
            //                     };

            //                     updatedSeller.legal = {
            //                         pan: pan,
            //                         aadhar: aadhar,
            //                         gst: gst,
            //                         bank: {
            //                             name: bankName,
            //                             accountNumber: accountNumber,
            //                             ifscCode: ifscCode
            //                         }
            //                     };

            //                     if (images[0])
            //                         updatedSeller.image = images[0];
            //                     if (images[1])
            //                         updatedSeller.legal.pan_image = images[1];
            //                     if (images[2])
            //                         updatedSeller.legal.aadhar_image_back = images[2];
            //                     if (images[3])
            //                         updatedSeller.legal.aadhar_image_front = images[3];
            //                     if (images[4])
            //                         updatedSeller.legal.gst_document = images[4];
            //                     if (images[5])
            //                         updatedSeller.legal.cancelled_cheque = images[5];

            //                     updatedSeller.save();
            //                     createApprovalRequest('Seller', updatedSeller.id);
            //                     console.log(updatedSeller);
            //                     return updatedSeller;
            //                 }
            //             );
            //         }
            //     );
            // } else {
            //     return Seller.findOneAndUpdate(
            //         {shopName: shopName},
            //         {
            //             $set: {
            //                 name: name,
            //                 about: about,
            //                 mobile: mobile,
            //                 intro: intro,
            //                 website: website
            //             }
            //         },
            //         {new: true}
            //     ).then(
            //         updatedSeller => {

            //             updatedSeller.address = [{
            //                 ...address
            //             }];

            //             updatedSeller.policy = {
            //                 store: store,
            //                 return: returnPolicy
            //             };

            //             updatedSeller.legal = {
            //                 pan: pan,
            //                 aadhar: aadhar,
            //                 gst: gst,
            //                 bank: {
            //                     name: bankName,
            //                     accountNumber: accountNumber,
            //                     ifscCode: ifscCode
            //                 }
            //             };

            //             updatedSeller.save();
            //             console.log(updatedSeller);
            //             createApprovalRequest('Seller', updatedSeller.id);
            //             return updatedSeller;
            //         }
            //     );
            // }


        },

        addSellerAddress: (parent, {input}, {seller}, info) => {
            return Seller.findOneAndUpdate({
                _id: seller.id
            }, {
                $addToSet: {
                    address: input.address
                }
            }, {
                new: true
            }).exec()
                .then(data => {
                    //console.log(data);
                    return data.address[data.address.length - 1];
                });
        },

        ChangePasswordSeller: (parent, {oldPassword, newPassword}, {seller}, info) => {
            return Seller.findOne({
                _id: seller.id
            })
                .exec()
                .then(
                    foundUser => {
                        const passwordIsValid = bcrypt.compareSync(oldPassword, foundUser.password);
                        console.log("Old password", oldPassword);
                        console.log("New password", newPassword);
                        console.log("Password is valid", passwordIsValid);

                        if (!passwordIsValid) {
                            return {
                                "success": false,
                                "message": "The entered password is invalid."
                            };
                        } else if (bcrypt.compareSync(newPassword, foundUser.password)) {
                            return {
                                "success": false,
                                "message": "The new password is same as the old password."
                            };
                        } else {
                            foundUser.password = newPassword;
                            foundUser.save().then(() => {
                                console.log("Updated password", foundUser.password);
                                return {
                                    "success": true,
                                    "message": "Password was updated."
                                };
                            });
                        }
                    }
                );
        },

        ForgotPasswordSeller: (parent, {shopName}, context, info) => {
            return Seller.findOne({shopName: shopName})
                .then(
                    foundSeller => {
                        if (!foundSeller) {
                            return {
                                "success": false,
                                "message": "No profile with this Shopname found"
                            };
                        } else {
                            const tempPassword = Math.random().toString(36).substr(2);
                            foundSeller.password = tempPassword;
                            return foundSeller.save().then(() => {
                                notifyUser(tempPassword, foundSeller);
                                return {
                                    "success": true,
                                    "message": "Password sent via SMS and Email"
                                };
                            });

                        }
                    }
                );
        },

        sendQueryToAdmin: (parent, {message, subject}, context, info) => {
            return Seller.findOne({_id: context.seller.id}).then(foundSeller => {
                if (foundSeller) {
                    message = message + `<br><br> By ${foundSeller.name} <br> ${foundSeller.shopName} `;

                    return sendEmailTo(subject, message, "pythonbrilliant@gmail.com", {
                        replyTo: foundSeller.email
                    }).then(data => {
                        // console.log(data);
                        return true;
                    }).catch(err => {
                        console.error(err);
                        return false;
                    });
                } else {
                    console.log("Seller not Found");
                    return false;
                }
            });
        },

        unapprovedLogin: (parent, {shopName, password}, context, info) => {
            return Seller.findOne({
                shopName: shopName
            })
                .exec()
                .then(
                    foundSeller => {
                        if (foundSeller && !foundSeller.approval.approved) {
                            const isValid = bcrypt.compareSync(password, foundSeller.password);
                            if (isValid) {
                                return foundSeller;
                            }
                        } else {
                            return null;
                        }
                    }
                );
        }
    }
};