import {getActiveUsersLastWeek} from "./utils";
import Order from '../models/order';
import moment from "moment";

module.exports = {
    Query: {
        getActiveUsersLastWeekBySeller: (parent, args, context, info) => {
            return getActiveUsersLastWeek().then(data => {
                // console.log(data);
                return data;
            });
        },

        getRevenuePerWeekBySeller: (parent, args, context, info) => {

            let endDate = moment();
            let startDate = moment().subtract(6, 'days');


            let date = new Date();
            date.setDate(date.getDate() - 6);
            // console.log(date);
            // console.log(context.seller.id);

            return Order.find({
                'products.seller': context.seller.id,
                'status.confirmed': true,
                date: {
                    "$gte": date
                }
            }).populate({
                path: 'products.product'
            }).then(data => {
                // console.log("GET REVENUE PER WEEK FOR SELLER",data);
                let di = {};
                data.forEach(order => {
                    let sum = 0;
                    order.products.map(product => {
                        if (product.seller.toString() === context.seller.id) {
                            // console.log("IN");
                            sum += product.product.price * product.itemCount;
                        }
                    });
                    // let date_to_string = order.date.toLocaleDateString();
                    let date_to_string = moment(order.date).format('DD-MM-YYYY');

                    if (di[date_to_string]) {
                        di[date_to_string] += sum;
                    } else {
                        di[date_to_string] = sum;
                    }

                });

                let results = [];
                // console.log(di);
                for (let m = moment(startDate); m.diff(endDate, 'days') <= 0; m.add(1, 'days')) {
                    let key = m.format('DD-MM-YYYY');
                    results.push({
                        date: key,
                        sales: di[key] || 0
                    });
                }
                return results;

                // return data;
            });
        },

        getRevenuePerWeekAdmin: (parent, args, context, info) => {

            let endDate = moment();
            let startDate = moment().subtract(6, 'days');

            let date = new Date();
            date.setDate(date.getDate() - 6);
            
            return Order.find({
                'status.confirmed': true,
                date: {
                    "$gte": date
                }
            }).populate({
                path: 'products.product'
            }).then(data => {
                let di = {};
                data.forEach(order => {
                    let sum = 0;
                    order.products.map(product => {                       
                        sum += product.product.price * product.itemCount;
                    });
                    // let date_to_string = order.date.toLocaleDateString();
                    let date_to_string = moment(order.date).format('DD-MM-YYYY');

                    if (di[date_to_string]) {
                        di[date_to_string] += sum;
                    } else {
                        di[date_to_string] = sum;
                    }

                });

                let results = [];
                // console.log(di);
                for (let m = moment(startDate); m.diff(endDate, 'days') <= 0; m.add(1, 'days')) {
                    let key = m.format('DD-MM-YYYY');
                    results.push({
                        date: key,
                        sales: di[key] || 0
                    });
                }
                return results;

                // return data;
            });
        },

        getRevenuePerMonthBySeller: (parent, args, context, info) => {

            let endDate = moment();
            let startDate = moment().subtract(30, 'days');


            let date = new Date();
            date.setDate(date.getDate() - 30);
            // console.log(date);
            // console.log(context.seller.id);

            return Order.find({
                'products.seller': context.seller.id,
                'status.confirmed': true,
                date: {
                    "$gte": date
                }
            }).populate({
                path: 'products.product'
            }).then(data => {

                let di = {};
                data.forEach(order => {
                    let sum = 0;
                    order.products.map(product => {
                        if (product.seller.toString() === context.seller.id) {
                            // console.log("IN");
                            sum += product.product.price * product.itemCount;
                        }
                    });
                    // let date_to_string = order.date.toLocaleDateString();
                    let date_to_string = moment(order.date).format('DD-MM-YYYY');

                    if (di[date_to_string]) {
                        di[date_to_string] += sum;
                    } else {
                        di[date_to_string] = sum;
                    }

                });

                let results = [];
                // console.log(di);
                for (let m = moment(startDate); m.diff(endDate, 'days') <= 0; m.add(1, 'days')) {
                    let key = m.format('DD-MM-YYYY');
                    results.push({
                        date: key,
                        sales: di[key] || 0
                    });
                }
                return results;

                // return data;

            });
        },

        getRevenuePerMonthAdmin: (parent, args, context, info) => {

            let endDate = moment();
            let startDate = moment().subtract(30, 'days');

            let date = new Date();
            date.setDate(date.getDate() - 30);
           
            return Order.find({
                'status.confirmed': true,
                date: {
                    "$gte": date
                }
            }).populate({
                path: 'products.product'
            }).then(data => {

                let di = {};
                data.forEach(order => {
                    let sum = 0;
                    order.products.map(product => {
                        sum += product.product.price * product.itemCount;
                    });
                    // let date_to_string = order.date.toLocaleDateString();
                    let date_to_string = moment(order.date).format('DD-MM-YYYY');

                    if (di[date_to_string]) {
                        di[date_to_string] += sum;
                    } else {
                        di[date_to_string] = sum;
                    }

                });

                let results = [];
                // console.log(di);
                for (let m = moment(startDate); m.diff(endDate, 'days') <= 0; m.add(1, 'days')) {
                    let key = m.format('DD-MM-YYYY');
                    results.push({
                        date: key,
                        sales: di[key] || 0
                    });
                }
                return results;

                // return data;

            });
        },

        getProductsPerWeekBySeller: (parent, args, context, info) => {

            let endDate = moment();
            let startDate = moment().subtract(6, 'days');


            let date = new Date();
            date.setDate(date.getDate() - 6);

            return Order.find({
                'products.seller': context.seller.id,
                'status.confirmed': true,
                date: {
                    "$gte": date
                }
            }).populate({
                path: 'products.product'
            }).then(data => {

                let di = {};
                data.forEach(order => {
                    let sum = 0;
                    order.products.map(product => {
                        if (product.seller.toString() === context.seller.id) {
                            sum += product.itemCount;
                        }
                    });
                    let date_to_string = moment(order.date).format('DD-MM-YYYY');

                    if (di[date_to_string]) {
                        di[date_to_string] += sum;
                    } else {
                        di[date_to_string] = sum;
                    }

                });

                let results = [];
                for (let m = moment(startDate); m.diff(endDate, 'days') <= 0; m.add(1, 'days')) {
                    let key = m.format('DD-MM-YYYY');
                    results.push({
                        date: key,
                        products: di[key] || 0
                    });
                }
                return results;

                // return data;


            });
        },

        getProductsPerWeekAdmin: (parent, args, context, info) => {

            let endDate = moment();
            let startDate = moment().subtract(6, 'days');

            let date = new Date();
            date.setDate(date.getDate() - 6);

            return Order.find({
                'status.confirmed': true,
                date: {
                    "$gte": date
                }
            }).populate({
                path: 'products.product'
            }).then(data => {

                let di = {};
                data.forEach(order => {
                    let sum = 0;
                    order.products.map(product => {
                        sum += product.itemCount;
                    });
                    let date_to_string = moment(order.date).format('DD-MM-YYYY');

                    if (di[date_to_string]) {
                        di[date_to_string] += sum;
                    } else {
                        di[date_to_string] = sum;
                    }

                });

                let results = [];
                for (let m = moment(startDate); m.diff(endDate, 'days') <= 0; m.add(1, 'days')) {
                    let key = m.format('DD-MM-YYYY');
                    results.push({
                        date: key,
                        products: di[key] || 0
                    });
                }
                return results;

                // return data;


            });
        },
    },
    Mutation: {}
};