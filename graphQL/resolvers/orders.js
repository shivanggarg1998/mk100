import {createSellerNotificationOnPurchase, generateEncRequest} from "./utils";

const Order = require('../models/order');
const Cart = require('../models/cart');
const Address = require('../models/address.js');
const generate = require('nanoid/generate');
const config = require('../config');


function transformToProducts(cart) {
    return cart.items.map(item => {
        return {
            product: item.item._id,
            seller: item.item.seller,
            itemCount: item.itemCount,
            selectedSize: item.selectedSize
        };
    });
}


module.exports = {
    Query: {
        allOrders: (parent, args, context, info) => {
            return Order.find({})
                .populate({
                    path: 'products.product',
                    populate: {
                        path: 'seller'
                    }
                })
                .populate('user')
                .populate('shipping.address')
                .exec()
                .then(
                    data => data
                );
        },
        Order: (parent, args, context, info) => {
            return Order.findOne({
                _id: args.id
            })
                .populate({
                    path: 'products.product',
                    populate: {
                        path: 'seller'
                    }
                })
                .populate('user')
                .exec()
                .then(
                    data => data
                );
        },
        getOrderByNumber: (parent, args, context, info) => {
            console.log(args);
            return Order.findOne({
                order_number: args.order_number
            })
                .populate({
                    path: 'products.product',
                    populate: {
                        path: 'seller'
                    }
                })
                .populate('user')
                .exec()
                .then(
                    data => data
                );
        },
        getOrdersByUser: (parent, args, context, info) => {
            return Order.find({
                user: context.user.id ,
                'status.confirmed' : true
            })
                .sort('-created_at')
                .populate({
                    path: 'products.product',
                    populate: {
                        path: 'seller'
                    }
                })
                .populate('user')
                .exec()
                .then(
                    data => data
                );
        },
        getOrdersBySeller: (parent, args, {seller}, info) => {
            // let result = [];
            console.log(seller.id);
            return Order
                .find({
                    'products.seller': seller.id,
                    'status.confirmed': true
                })
                .populate({
                    path: 'products.product',
                    populate: {
                        path: 'seller'
                    }
                })
                .populate('user')
                .sort('-date')
                // .populate('shipping.address')
                .exec()
                .then(orders => {
                    // data = data.toJSON();
                    return orders.map(order => {

                        let products = order.products;
                        products = products.filter(product => {
                            if (product.seller == seller.id) {
                                return true;
                            }
                            return false;
                        });
                        order.products = products;
                        return order;

                    });

                })
                .then(data => data);
        }
    },

    Mutation: {
        addOrder: (parent, {input}, context, info) => {
            return Order.create({
                user: input.userID,
                discount: input.discount,
                total: input.total,
                date: input.date,
                payment: input.payment,
                shipping: {status: null, address: null},
                status: input.status
            }).then(
                createdOrder => {
                    input.products.forEach(function (prod) {
                        createdOrder.products.push(prod);
                    });
                    Address
                        .create(input.shipping.address)
                        .then(
                            createdAddress => {
                                createdAddress.shipping = {
                                    status: input.shipping.status,
                                    address: createdAddress
                                };
                            }
                        );
                    createdOrder.save();
                    return createdOrder
                        .populate({
                            path: 'products.product',
                            populate: {
                                path: 'seller'
                            }
                        })
                        .populate('user')
                        .execPopulate().then(
                            data => {
                                return {
                                    order: data.toJSON()
                                };
                            }
                        );
                }
            );
        },

        addOrderFromCart: (parent, {input}, context, info) => {
            return Cart.findOne({user: context.user.id}).populate('items.item').then(
                foundCart => {
                    // console.log(foundCart);
                    const alphabet = '0123456789';
                    let order_number = generate(alphabet, 21).toString(); //=> "347249770509105530937"

                    let total = 0;
                    foundCart.items.forEach(
                        cartItem => total += cartItem.item.price * cartItem.itemCount
                    );
                    let products = transformToProducts(foundCart);
                    console.log(products);

                    return Order.create({
                        user: context.user.id,
                        discount: 0,
                        order_number: order_number,
                        total: total,
                        products: products,
                        date: new Date().toISOString(),
                        shipping: {address: input.address},
                    }).then(
                        createdOrder => {

                            // TODO : Clear the Cart.
                            return Cart.deleteOne({
                                _id: foundCart.id
                            }).then(deletedInfo => {

                                // createSellerNotificationOnPurchase(createdOrder);

                                return createdOrder
                                    .populate({
                                        path: 'products.product',
                                        populate: {
                                            path: 'seller'
                                        }
                                    })
                                    .populate('user')
                                    .execPopulate().then(
                                        data => {

                                            createSellerNotificationOnPurchase(data);
                                            return {
                                                order: data.toJSON()
                                            };
                                        }
                                    );

                            });


                        }
                    );
                }
            );
        },
        confirmProductFromOrder: (parent, {input}, context, info) => {
            return Order.findOne({
                order_number: input.order_number
            }).then(foundOrder => {
                let product = foundOrder.products.id(input.product_id);
                if (product.seller != context.seller.id) {
                    return {
                        success: false
                    };
                }
                console.log(foundOrder.products.id(input.product_id).status.confirmed);
                foundOrder.products.id(input.product_id).status.confirmed = true;
                console.log(foundOrder.products.id(input.product_id).status.confirmed);
                return foundOrder.save().then(_ => {
                    return {
                        success: true
                    };
                }).catch(err => {
                    console.error(err);
                });

            });
        },
        removeOrder: (parent, args, context, info) => {
            return Order.findOneAndDelete({
                _id: args.orderID
            }).populate('products').populate('user').exec().then(
                data => data
            );
        },
        getEncryptedRequest: (parent, args, context, info) => {
            return Order.findOne({
                _id: args.orderID
            }).populate('user').then(foundOrder => {
                let response = {
                    access_code: config.access_code,
                    encRequest: generateEncRequest(foundOrder)
                };
                return response;
            });
        }
    }
};