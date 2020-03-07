const User = require('../models/user');
const Address = require('../models/address');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

import {
    uploadToS3
} from '../middlewares/upload';
import {sendSMSTo, sendEmailTo} from './utils';

const notifyUser = (tempPassword, email, mobile) => {
    // send email and SMS
    console.log(email);
    console.log(mobile);

    sendSMSTo(
        `Hello User, your temporary password is ${tempPassword}. Kindly use it to log into your account and change it.`,
        mobile
    );

    sendEmailTo(
        "Forgot password",
        `
            <strong>Hi User,</strong>
            <p>Your temporary password is ${tempPassword}. Kindly use it to log into your account and change it.</p>
            <strong>Regards, Team mk100</strong>
        `,
        email
    );
}

module.exports = {
    Mutation: {
        CreateUser: (parent, {input}, context, address) => {
            let {
                email,
                password,
                username
            } = input;
            // console.log(input);
            return User.findOne({
                email: email
            }).exec()
                .then(
                    foundUser => {
                        if (foundUser) {
                            return {
                                token: {
                                    code: 2,
                                    content: "Email already registered"
                                }
                            };
                        } else {
                            // checking for unique username
                            return User.findOne({
                                username: username
                            }).exec()
                                .then(
                                    foundUsername => {
                                        if (foundUsername) {
                                            console.log("Username found");
                                            return {
                                                token: {
                                                    code: 6,
                                                    content: "Username already taken"
                                                }
                                            };
                                        } else {
                                            const hashedPassword = bcrypt.hashSync(password);
                                            return User.create({
                                                email: email,
                                                password: hashedPassword,
                                                username: username
                                            }).then(
                                                createdUser => {
                                                    console.log(createdUser);
                                                    const token = jwt.sign({
                                                            id: createdUser._id,
                                                            username: createdUser.username,
                                                            email: createdUser.email,
                                                            finished: createdUser.finished.signup
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
                                            );
                                        }
                                    }
                                );
                        }
                    }
                );
        },

        CompleteSignup: (parent, {details, address, following, categories}, {user}, info) => {
            let {
                name,
                // image,
                about,
                mobile
            } = details;
            // return image.then((data) => {
            //     const {
            //         stream,
            //         filename,
            //         mimetype,
            //         encoding
            //     } = data;
            //     return uploadToS3(filename, stream).then((data) => {
                    return User.findOne({
                            email: user.email
                        }).exec()
                        .then(
                            (foundUser) => {
                                // console.log("DETAILS TO STORE -->", details);
                                // console.log("FOUNDUSE --> ",foundUser);
                                foundUser.name = name;
                                // foundUser.image = data;
                                foundUser.mobile = mobile;
                                foundUser.about = about;
                                foundUser.address = address;
                                // foundUser.followingShop = following;
                                foundUser.categories = categories;
                                foundUser.finished.signup = true;
                                foundUser.save();

                        const token = jwt.sign({
                                id: foundUser._id,
                                name: foundUser.name,
                                // image: foundUser.image,
                                email: foundUser.email,
                                about: foundUser.about,
                                username: foundUser.username,
                                finished: foundUser.finished.signup
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
                );
                // })
            // })
        },

        // Not being used anymore but updated with changes made in type definitions
        UserSignup: (parent, {input, details, address}, context, info) => {
            let {
                email,
                password,
                username
            } = input;
            let {
                name,
                // image,
                about
            } = details;
            let {
                street,
                city,
                state,
                zipcode
            } = address;

            return User.findOne({
                email: email
            }).exec()
                .then(
                    foundUser => {
                        if (foundUser) {
                            return {
                                token: {
                                    code: 2,
                                    content: "Email already registered"
                                }
                            };
                        } else {
                            const hashedPassword = bcrypt.hashSync(password);

                            return User.create({
                                email: email,
                                password: hashedPassword,
                                name: name,
                                // image: image,
                                about: about,
                                username: username
                            }).then(
                                createdUser => {

                                    // TODO : Address Sahi Karo Yaha Pe.

                                    return Address.create({
                                        address: address.address,
                                        street: street,
                                        city: city,
                                        state: state,
                                        zipcode: zipcode
                                    }).then(
                                        createdAddress => {
                                            createdUser.address = createdAddress;
                                            createdUser.save();

                                            const token = jwt.sign({
                                                    id: foundUser._id,
                                                    name: foundUser.name,
                                                    // image: foundUser.image,
                                                    email: foundUser.email,
                                                    about: foundUser.about,
                                                    username: foundUser.username,
                                                    finished: foundUser.finished.signup
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
                                    );

                                }
                            );
                        }
                    }
                );

        },

        UserLogin: (parent, {input}, context, info) => {
            console.log(input);
            let {
                email,
                password
            } = input;

            return User.findOne({
                email: email
            }).exec()
                .then(
                    foundUser => {
                        if (foundUser) {
                            const passwordIsValid = bcrypt.compareSync(password, foundUser.password);
                            if (!passwordIsValid) {
                                return {
                                    token: {
                                        code: 3,
                                        content: "Invalid Password"
                                    }
                                };
                            } else {
                                const token = jwt.sign({
                                        id: foundUser._id,
                                        name: foundUser.name,
                                        // image: foundUser.image,
                                        email: foundUser.email,
                                        about: foundUser.about,
                                        username: foundUser.username,
                                        finished: foundUser.finished.signup
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
                                    content: "Email not registered"
                                }
                            };
                        }
                        return response;
                    }
                );
        },

        ChangePassword: (parent, {oldPassword, newPassword}, {user}, info) => {
            return User.findOne({
                _id: user.id
            })
            .exec()
            .then(
                foundUser => {
                    const passwordIsValid = bcrypt.compareSync(oldPassword, foundUser.password);

                    if (!passwordIsValid) {
                        return {
                            "success": false,
                            "message": "The entered password is invalid."
                        }
                    } else if (bcrypt.compareSync(newPassword, foundUser.password)) {
                        return {
                            "success": false,
                            "message": "The new password is same as the old password."
                        }
                    } else {
                        foundUser.password = bcrypt.hashSync(newPassword);;
                        foundUser.save();
                        return {
                            "success": true,
                            "message": "Password was updated."
                        }
                    }
                }
            )
        },

        ForgotPassword: (parent, {email}, context, info) => {
            return User.findOne({email: email})
                .then(
                    foundUser => {
                        if (!foundUser) {
                            return {
                                "success": false,
                                "message": "No profile with this username found"
                            }
                        } else {
                            const tempPassword = Math.random().toString(36).substr(2);
                            const hashedPassword = bcrypt.hashSync(tempPassword);
                            console.log(tempPassword);
    
                            foundUser.password = hashedPassword;
                            foundUser.save();
                            notifyUser(tempPassword, foundUser.email, foundUser.mobile);
                            return {
                                "success": true,
                                "message": "Password sent via SMS and Email"
                            }
                        }
                    }
                );
                
        }
    }
};