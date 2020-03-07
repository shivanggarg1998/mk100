const sgMail = require('@sendgrid/mail');
import crypto from 'crypto';
import qs from 'qs';
import {google} from 'googleapis';
import moment from 'moment';
import path from 'path';
import request from 'request';

import Approval from './../models/approval';
import Feed from './../models/feed';
import Notification from '../models/notification';
import Seller from '../models/seller';
import config from "../config";

sgMail.setApiKey(config.send_grid);

export const sendSMSTo = (message, mobile) => {
    const auth = config.msg91;
    const URL = `http://api.msg91.com/api/sendhttp.php?country=91&sender=Dmk100&route=4&mobiles=${mobile}&authkey=${auth}&message=${message}.`;
    request(URL, function (res, err, body) {
        console.log("TEXT SENT");
    });
};

export const sendEmailTo = (subject, message, email, extras = {}) => {
    const msg = {
        to: email,
        from: {
            name: 'mk100',
            email: 'connect@mk100.in',
        },
        subject: subject,
        html: message,
        ...extras
    };
    return sgMail.send(msg);
};

export async function getActiveUsersLastWeek() {

    const googleClient = await google.auth.getClient({
        keyFile: path.join(__dirname, 'e-commerce-60b22c41898a.json'),
        scopes: 'https://www.googleapis.com/auth/analytics.readonly',
    });

    // Obtain a new drive client, making sure you pass along the auth client
    const analyticsreporting = google.analyticsreporting({
        version: 'v4',
        auth: googleClient,
    });

    let endDate = moment();
    let startDate = moment().subtract(6, 'days');

    console.log(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));

    const res = await analyticsreporting.reports.batchGet({
        requestBody: {
            "reportRequests": [
                {
                    "viewId": "182993290",
                    "dateRanges": [
                        {
                            startDate: startDate.format('YYYY-MM-DD'),
                            endDate: endDate.format('YYYY-MM-DD')
                        }
                    ],
                    "metrics": [
                        {
                            "expression": "ga:users",
                            "alias": ""
                        }
                    ],
                    "dimensions": [
                        {
                            "name": "ga:date"
                        }
                    ]
                }
            ]
        }
    });
    let di = {};
    let data = res.data.reports[0].data;
    console.log(data);
    data.rows.map(row => {
        di[row.dimensions[0]] = row.metrics[0].values[0];
    });
    console.log(di);
    let results = [];

    for (let m = moment(startDate); m.diff(endDate, 'days') <= 0; m.add(1, 'days')) {
        let key = m.format('DD-MM-YYYY');
        let search = m.format('YYYYMMDD');
        results.push({
            date: key,
            users: di[search] || 0
        });
    }

    return results;
}

export function createApprovalRequest(approvalType, originId) {

    let approval = new Approval({
        approvalType,
        origin: originId,
        refString: approvalType,
        comment: ''
    });

    approval.save().then(data => {
        console.log("APPROVAL REQUEST", data);
        // TODO : Take a Action Like SMS or Email For New Approval Created
        // TODO : Create A Notification For Admin

        if (approvalType === 'Seller') {
            Seller.findOne({
                _id: originId
            }).then(
                data => {
                    const email = data.email;
                    const mobile = data.mobile;

                    const message = `
                        Hello, ${data.name}. You have submitted your shop profile, ${data.shopName}, for approval on mk100. Within 48 hours, you will hear back from us. We will be here to help you with any step along the way. Yours, mk100
                    `;
                    const emailSubject = "Profile Submission";
                    const emailMessage = `
                        <p>Hello, ${data.name}</p>
                        <p>
                            You have submitted your shop profile, ${data.shopName}, for approval on mk100.
                            Within 48 hours, you will hear back from us. We will be here to help you with any step along the way.
                        </p>
                        <p>
                            Yours,
                            <strong>mk100</strong>
                        </p>

                    `;
                    sendSMSTo(message, mobile);
                    sendEmailTo(emailSubject, emailMessage, email);
                }
            );
        }

        Notification.create({
            text: `New approval request for a ${approvalType}`,
            action: `/approval/${approvalType.toLowerCase()}s`,
            // to: 'Admin'
        }).then(
            createdNotif => console.log("Notif", createdNotif)
        );

    }).catch(err => {
        console.error(err);
        sendErrorReport("Unable To Correct Approval", {
            approvalType,
            originId
        });
    });

}

export function sendEmailToSellerApproval(sellerID) {
    Seller.findOne({
        _id: sellerID
    }).then(
        data => {
            const email = data.email;
            const mobile = data.mobile;
            const status = data.approval.approved;

            console.log("Status", status);

            const message = status
                ? "Hello Seller, your shop profile has been approved. You can now log on to sellers.mk100.in. Yours, mk100."
                : `Hello Seller, your shop profile has been rejected. Message - ${data.approval.message}. Yours, mk100.`;

            const emailSubject = status ? "Profile Approved" : "Profile Rejected";
            const emailMessage = status
                ?
                `
                    <p>Hello, ${data.name}</p>
                    <p>
                        Your shop profile, ${data.shopName}, has been approved. Please log in to your account on sellers.mk100.in to access your dashboard.
                        We will be here to help you with any step along the way.
                    </p>
                    <p>
                        Yours,
                        <strong>mk100</strong>
                    </p>
                `
                : `
                    <p>Hello, ${data.name}</p>
                    <p>
                        Your shop profile, ${data.shopName}, has been rejected. Please log in to your account on sellers.mk100.in/shop/unapproved/login to access your dashboard.
                        We will be here to help you with any step along the way.
                        <br/>
                        Message from admin - ${data.approval.message}
                    </p>
                    <p>
                        Yours,
                        <strong>mk100</strong>
                    </p>
                `;

            sendSMSTo(message, mobile);
            sendEmailTo(emailSubject, emailMessage, email);
        }
    );
}

export function createFeedItem(feedType, originId, keyId, event, ParentData) {

    let feed = new Feed({
        event: event,
        origin: originId,
        key: keyId,
        refString: feedType,
    });

    feed.save().then(data => {
        console.log(data);
        if (event == 'Seller Post is added') {
            createNotificationSellerpost(ParentData, data.id);
        }
        // TODO : Take a Action Like SMS or Email For New Approval Created
        // TODO : Create A Notification For Admin


    }).catch(err => {
        console.error(err);
        sendErrorReport("Unable To Create feed item", {
            feedType,
            originId,
            event
        });
    });

}

// Not Tested
export function createNotificationProduct(data) {
    console.log(data);
    Seller.findOne({
        _id: data.seller
    }).then(
        foundSeller => {
            if (data.approval.approved) {
                Feed.findOne({event: 'Product is added', origin: data.id}).then((feed) => {
                    Notification.create({
                        text: `${foundSeller.name} added a product - ${data.name}`,
                        action: `${feed.id}`,
                        image: data.image,
                        to: foundSeller.followers
                    }).then(
                        data => console.log(data)
                    ).catch(
                        err => console.log(err)
                    );
                });

                Notification.create({
                    text: `Your product - ${data.name} is approved `,
                    action: `/product/${data.id}/view`,
                    image: data.image,
                    to: foundSeller.id
                }).then(
                    data => console.log(data)
                ).catch(
                    err => console.log(err)
                );
            } else {
                Notification.create({
                    text: `Your product - ${data.name} was rejected `,
                    action: `/product/${data.id}/view`,
                    image: data.image,
                    to: foundSeller.id
                }).then(
                    data => console.log(data)
                ).catch(
                    err => console.log(err)
                );
            }
        }
    );
}

// Tested
export function createNotificationSellerpost(data, id) {
    // console.log(data);
    Seller.findOne({
        _id: data.seller.id
    }).then(
        foundSeller => {
            Notification.create({
                text: `${data.seller.name} added a post`,
                action: `${id}`,
//                 action: `/feed/`,
                image: data.image,
                to: foundSeller.followers
            }).then(
                data => console.log(data)
            );
        }
    );
}


export function createSellerNotificationOnPurchase(foundOrder) {
    console.log(foundOrder.products);

    foundOrder.products.forEach(product => {
        Notification.create({
            to: product.seller,
            text: `New Order for Product ${product.product.name}. Quantity : ${product.itemCount}`,
            image: product.product.image,
            action: `/orders/`
        }).then(
            data => console.log(data)
        );
    });


}

export function createdNotificationFollow(followedBy, following) {
    console.log(followedBy, following);

    Notification.create({
        to: following.id,
        text: `${followedBy.name} followed you`,
        image: followedBy.image,
        action: `/user/${followedBy.username}`
    }).then(
        data => console.log(data)
    );
}


export function createNotificationForGroup(input) {
    console.log(input);
    Notification.create({
        to: input.to,
        text: input.text,
        image: input.image,
        action: input.action,
    }).then(
        data => console.log(data)
    ).catch(
        err => console.log(err)
    );
}

// TODO : Send a MAIL TO DEV TEAM
export function sendErrorReport(message, data) {
    console.log("New Error Reported");
}

export function generateEncRequest(order) {
    console.log(order);
    let body = {
        merchant_id: config.merchant_id,
        order_id: order.id,
        currency: 'INR',
        amount: order.total,
        redirect_url: config.redirect_url,
        cancel_url: config.cancel_url,
        language: 'en',
        billing_name: order.user.name,
        billing_address: order.shipping.address.address + ", " + order.shipping.address.street,
        billing_city: order.shipping.address.city,
        billing_state: order.shipping.address.state,
        billing_zip: order.shipping.address.zipcode,
        billing_country: "India",

    };
    // console.log(body.toString());
    let encRequest = encrypt(body);
    return encRequest;
}


export function encrypt(body) {
    let plainText = qs.stringify(body);
    var m = crypto.createHash('md5');
    m.update(config.working_key);
    var key = m.digest();
    var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
    var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    var encoded = cipher.update(plainText, 'utf8', 'hex');
    encoded += cipher.final('hex');
    return encoded;
};


export function decrpyt(encText, workingKey) {
    var m = crypto.createHash('md5');

    m.update(workingKey);
    var key = m.digest();
    var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
    var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    var decoded = decipher.update(encText, 'hex', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
};

export function createShippingQuote(foundOrder, productItem, seller) {

    let requestBody = {
        "seller": {
            "address": seller.address.address,
            "city": "Mumbai",
            "country": "India",
            "email": "allwyn.lobo@vamaship.com",
            "name": "Dorian Gray",
            "phone": "99999999999",
            "pincode": "400005",
            "state": "Maharashtra"
        },
        "shipments": [
            {
                "address": "abc, xyz",
                "awb": "5109128390238",
                "breadth": "10",
                "city": "Jaipur",
                "country": "India",
                "email": "george.cloney@hollywood.com",
                "height": "10",
                "is_cod": false,
                "length": "10",
                "name": "George Cloney",
                "phone": "88888888888",
                "pickup_date": "2015-12-20T14:15:16+05:30",
                "pincode": "400013",
                "product": "Diary",
                "product_value": 100,
                "quantity": 1,
                "reference1": "002",
                "reference2": "refno2",
                "state": "Rajasthan",
                "unit": "cm",
                "weight": "0.6"
            }
        ]
    };


}