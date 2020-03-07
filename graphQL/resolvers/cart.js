const User = require('../models/user');
const Cart = require('../models/cart');

module.exports = {
    Query: {
        getCart: (parent, args, context, info) => {
            const userId = context.user.id;
            return Cart.findOne({user: userId})
                .populate({
                    path: 'items.item',
                    populate: {
                        path: 'seller'
                    }
                })
                .populate('user')
                .exec()
                .then(
                    data => {
                        // console.log(data)
                        return data;
                    }
                );
        }
    },
    Mutation: {
        addToCart: (parent, {input}, context, info) => {

            let {productID, itemCount, selectedSize} = input;
            let userId = context.user.id;

            return Cart.findOne({user: userId}).exec().then(
                foundCart => {
                    if (!foundCart) {
                        return Cart.create({
                            user: userId,
                            items: [{
                                item: productID,
                                itemCount: itemCount,
                                selectedSize: selectedSize
                            }]
                        }).then(
                            createdCart => {
                                return createdCart
                                    .populate({
                                        path: 'items.item',
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

                        let itemInCart = false;
                        console.log(productID, itemCount, selectedSize);
                        // let newItems = [];
                        foundCart.items.forEach(item => {
                            if (item.item == productID && item.selectedSize === selectedSize) {
                                itemInCart = true;
                                item.itemCount += itemCount;
                                // newItems.push();
                            }
                        });
                        if (!itemInCart) {
                            foundCart.items.push(
                                {
                                    item: productID,
                                    itemCount: itemCount,
                                    selectedSize: selectedSize
                                }
                            );
                        }
                        console.log(foundCart.items);


                        // foundCart.items = newItems;

                        foundCart.save();
                        return foundCart
                            .populate({
                                path: 'items.item',
                                populate: {
                                    path: 'sellerID'
                                }
                            })
                            .populate('user')
                            .execPopulate()
                            .then(data => data.toJSON());
                    }
                }
            );
        },
        removeFromCart: (parent, {input}, context, info) => {
            let {index} = input;
            let userId = context.user.id;

            return Cart.findOne({user: userId}).exec().then(
                foundCart => {
                    foundCart.items.splice(index, 1);
                    foundCart.save();
                    // console.log(foundCart);
                    return foundCart
                        .populate('items.item')
                        .populate('user')
                        .execPopulate()
                        .then(data => data.toJSON());
                }
            );
        }
    }
};