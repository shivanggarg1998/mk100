import Admin from '../models/admin';
import jwt from 'jsonwebtoken';
import config from '../config';

module.exports = {
    Mutation: {
        AdminLogin: (parent, {input}, context, info) => {
            let { username, password } = input;

            return Admin.findOne({username: username}).then(
                foundAdmin => {
                    if (foundAdmin) {
                        const isPasswordValid = foundAdmin.comparePassword(password);
                        if (isPasswordValid) {
                            const token = jwt.sign(
                                {
                                    id: foundAdmin._id,
                                    name: foundAdmin.name,
                                    email: foundAdmin.email,
                                    username: foundAdmin.username,
                                    admin: true
                                },
                                config.secret,
                                {expiresIn: 60 * 60 * 24 * 7}
                            );
                            return {
                                token: {
                                    code: 1,
                                    content: token
                                }
                            };
                        } else {
                            return {
                                token: {
                                    code: 3,
                                    content: "Invalid Password"
                                }
                            };
                        }
                    } else {
                        return {
                            token: {
                                code: 4,
                                content: "Admin not registered"
                            }
                        }
                    }
                }
            )
        },

        AdminSignUp: (parent, {input}, context, info) => {

            console.log(input);

            return Admin.findOne({username: input.username}).then(
                foundAdmin => {
                    if (foundAdmin) {
                        return {
                            token: {
                                code: 2,
                                content: "Username already registered"
                            }
                        };
                    } else {
                        return Admin.create(input).then(
                            createdAdmin => {
                                const token = jwt.sign(
                                    {
                                        id: createdAdmin._id,
                                        name: createdAdmin.name,
                                        email: createdAdmin.email,
                                        username: createdAdmin.username,
                                        admin: true
                                    },
                                    config.secret,
                                    {expiresIn: 60 * 60 * 24 * 7}
                                );
                                return {
                                    token: {
                                        code: 1,
                                        content: token
                                    }
                                };
                            }
                        )
                    }
                }
            );
        }
    }
}