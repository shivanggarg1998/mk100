// const request = require('request');
// import axios from 'axios';
// import qs from 'qs';

// const Order = require("../models/order");
// const Seller = require("../models/seller");
// import moment from 'moment' ;
// import {vamaship_key as key, vamaship_url as url} from "../config";

// const generateOption = (endpoint, method, data) => {
//     const options = {
//         url: `${url}${endpoint}`,
//         method: method,
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//             'Authorization': key,
//         },
//         data: qs.stringify(data)
//     };
//     // console.log(options);
//     return options;
// };

// const prepareInput = (order, seller, selected, product_id, dimensions, weight) => {

//     const add = seller.address[selected];
//     const custAdd = order.shipping.address;
//     const user = order.user;
//     let product = {};
//     let count;

//     let pickUpDate = moment();

//     order.products.forEach(
//         item => {
//             // console.log(item , item.product, product_id);
//             if (item.seller == seller.id && item._id == product_id) {
//                 product = item.product;
//                 count = item.itemCount;
//             }
//         }
//     );

//     const input = {
//         "seller": {
//             "address": add.address + ", " + add.street,
//             "city": add.city,
//             "country": "India",
//             "email": seller.email,
//             "name": seller.name,
//             "phone": seller.mobile,
//             "pincode": add.zipcode,
//             "state": add.state
//         },
//         "shipments": [{
//             "surface_category": "b2b",

//             "address": custAdd.address + ", " + custAdd.street,
//             "city": custAdd.city,
//             "state": custAdd.state,
//             "country": "India",
//             "pincode": custAdd.zipcode,

//             "email": user.email,
//             "name": user.name,
//             "phone": "88888888888",

//             "breadth": dimensions.breadth,
//             "length": dimensions.length,
//             "height": dimensions.height,
//             "unit": "cm",
//             "pkg_weight": weight,
//             "weight": weight,

//             "is_cod": order.payment.mode === "Cash of Delivery",
//             "pickup_date": pickUpDate.toISOString(),

//             "product": product.name,
//             "product_value": product.price,
//             "quantity": count,

//             // Reference 1 -> For Order ID ,
//             // Reference 2 -> For Item ID in Product

//             "reference1": order._id.toString(),
//             "reference2": product_id,
//         }]
//     };

//     return input;
// };

// const prepareReverseInput = (order, product_id) => {

//     let product = {};
//     let pickUpDate = moment();

//     order.products.forEach(
//         item => {
//             // console.log(item , item.product, product_id);
//             if (item._id == product_id) {
//                 product = item;
//             }
//         }
//     );

//     const input = product.shipping.input;
//     console.log(JSON.stringify(input, null, 4));
//     input.shipments[0].pickup_date = pickUpDate.toISOString();

//     return input;
// };


// module.exports = {
//     Query: {
//         getShippingQuote: (parent, {input}, {seller}, info) => {
//             let {orderID, addressSelected, productID, dimensions, weight} = input;
//             return Order.findOne({_id: orderID})
//                 .populate('products.product')
//                 .populate('user').exec()
//                 .then(
//                     foundOrder => {
//                         return Seller.findOne({_id: seller.id}).exec()
//                             .then(
//                                 foundSeller => {
//                                     const inputToAPI = prepareInput(foundOrder, foundSeller, addressSelected, productID, dimensions, weight);
//                                     // console.log(JSON.stringify(inputToAPI, null, 4));
//                                     const optionsForRequest = generateOption('/surface/quote', 'POST', inputToAPI);

//                                     return axios.request(optionsForRequest).then(response => {
//                                         let body = response.data;
//                                         // console.log("Here", body);

//                                         if (body.success) {
//                                             let isShipment = false;
//                                             let minPrice = 1000000000000;
//                                             let minDay = 100000000000;

//                                             let quote = body.quotes[0];
//                                             isShipment = quote.success;

//                                             quote.suppliers.forEach(supplier => {
//                                                 if (supplier.shipping_cost < minPrice) {
//                                                     minPrice = supplier.shipping_cost;
//                                                     minDay = supplier.duration;
//                                                 }
//                                             });

//                                             return {
//                                                 success: isShipment,
//                                                 price: minPrice,
//                                                 duration: minDay
//                                             };

//                                         } else {
//                                             return {
//                                                 success: false,
//                                                 price: undefined,
//                                                 duration: undefined
//                                             };
//                                         }

//                                     }).catch(err => {
//                                         console.log(err.message);
//                                     });


//                                 }
//                             );
//                     }
//                 );
//         },

//         checkCoverage: (parent, {pincode}, context, info) => {
//             const inputToAPI = {
//                 "type": "cod",
//                 "origin": pincode
//             };
//             const optionsForRequest = generateOption('/surface/coverage', 'POST', inputToAPI);

//             const responsePromise = new Promise(
//                 (resolve, reject) => {
//                     request(optionsForRequest, function (err, res, body) {
//                         if (!err) {
//                             body = JSON.parse(body);
//                             console.log(body);
//                             resolve(body.success);
//                         } else {
//                             reject(false);
//                         }
//                     });
//                 }
//             );

//             return responsePromise;
//         },

//         getShipmentTrackingDetails: (parent, {orderID, productID}, context, info) => {
//             return Order.findOne({_id: orderID})
//                 .populate('products.product')
//                 .populate('user').exec()
//                 .then(
//                     foundOrder => {
//                         let i;
//                         foundOrder.products.forEach(
//                             (item, index) => {
//                                 if (item._id == productID) {
//                                     i = index;
//                                     return;
//                                 }
//                             }
//                         );

//                         const shipping = foundOrder.products[i].shipping.response;

//                         if (shipping.status_code == 200) {
//                             const shipment_order_id = shipping.shipments[0].order_id;

//                             const optionsForRequest = generateOption(`/track/${shipment_order_id}`, 'GET', null);

//                             return axios.request(optionsForRequest).then(
//                                 response => response.data.tracking_details[0]
//                             );
//                         } else {
//                             return {
//                                 "success": true,
//                                 "message": "Shipment Under Process with Courier Partner"
//                             };
//                         }


//                     }
//                 );
//         },
//         getShipmentDetails: (parent, {orderID, productID}, context, info) => {
//             return Order.findOne({_id: orderID})
//                 .populate('products.product')
//                 .populate('user').exec()
//                 .then(
//                     foundOrder => {
//                         let i;
//                         foundOrder.products.forEach(
//                             (item, index) => {
//                                 if (item._id == productID) {
//                                     i = index;
//                                     return;
//                                 }
//                             }
//                         );

//                         const refid = foundOrder.products[i].shipping.refid;
//                         const statusCode = foundOrder.products[i].shipping.response.status_code;

//                         if (statusCode === 300) {
//                             const optionsForRequest = generateOption(`/details/${refid}`, 'GET', null);

//                             return axios.request(optionsForRequest).then(
//                                 response => {
//                                     let body = response.data;
//                                     foundOrder.products[i].shipping.response = body;
//                                     foundOrder.save();
//                                     // console.log("Here", body);
//                                     return body;
//                                 }
//                             );
//                         } else if (statusCode === 200) {
//                             let data = foundOrder.products[i].shipping.response;
//                             // console.log(data);
//                             return data;
//                         }
//                     }
//                 );
//         }
//     },

//     Mutation: {
//         bookShipment: (parent, {input}, {seller}, info) => {
//             let {orderID, addressSelected, productID, dimensions, weight} = input;
//             return Order.findOne({_id: orderID})
//                 .populate('products.product')
//                 .populate('user').exec()
//                 .then(
//                     foundOrder => {
//                         return Seller.findOne({_id: seller.id}).exec()
//                             .then(
//                                 foundSeller => {
//                                     const inputToAPI = prepareInput(foundOrder, foundSeller, addressSelected, productID, dimensions, weight);
//                                     // console.log(JSON.stringify(inputToAPI, null, 4));
//                                     const optionsForRequest = generateOption('/surface/book', 'POST', inputToAPI);
//                                     return axios.request(optionsForRequest).then(response => {
//                                         let body = response.data;
//                                         console.log("Here", body);

//                                         // store refid in DB
//                                         if (body.success) {
//                                             foundOrder.products.forEach(
//                                                 (item, index) => {
//                                                     if (item._id == productID) {
//                                                         foundOrder.products[index].shipping = {
//                                                             refid: body.refid,
//                                                             response: body,
//                                                             input: inputToAPI
//                                                         };
//                                                         foundOrder.products[index].status.shipped = true;
//                                                         foundOrder.save();
//                                                     }
//                                                 }
//                                             );
//                                         }
//                                         return body.success;
//                                     }).catch(err => {
//                                         console.log(err.message);
//                                     });
//                                 }
//                             );
//                     }
//                 );
//         },
//         bookReturnShipment: (parent, args, {seller}, info) => {
//             let {orderID, productID} = args;
//             return Order.findOne({_id: orderID})
//                 .populate('products.product')
//                 .populate('user').exec()
//                 .then(foundOrder => {

//                         const inputToAPI = prepareReverseInput(foundOrder, productID);
//                         console.log(JSON.stringify(inputToAPI, null, 4));

//                         const optionsForRequest = generateOption('/surface/book', 'POST', inputToAPI);
//                         return axios.request(optionsForRequest).then(response => {
//                             let body = response.data;
//                             console.log("Here", body);

//                             if (body.success) {
//                                 foundOrder.products.forEach(
//                                     (item, index) => {
//                                         if (item._id == productID) {
//                                             foundOrder.products[index].return = {
//                                                 refid: body.refid,
//                                                 return: body,
//                                                 input: inputToAPI
//                                             };
//                                             foundOrder.products[index].status.returned = true;
//                                             foundOrder.save();
//                                         }
//                                     }
//                                 );
//                             }
//                             return body.success;
//                         }).catch(err => {
//                             console.log(err.message);
//                         });
//                     }
//                 );

//         }

//     }
// };