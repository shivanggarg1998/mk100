import qs from 'querystring';
import {decrpyt} from '../resolvers/utils';
import config from '../config';
import Order from '../models/order';

export const ccAvenueRedirectCallback = (req, res, next) => {
    console.log(req.query);
    console.log(req.body);
    let body = req.body;
    let encryption = body.encResp;
    let ccavResponse = decrpyt(encryption, config.working_key);
    ccavResponse = qs.parse(ccavResponse);
    console.log(ccavResponse);

    Order.findOne({_id: ccavResponse.order_id}).then(foundOrder => {
        let formattedResponse = {
            status: ccavResponse.order_status,
            mode: ccavResponse.payment_mode,
            response: ccavResponse
        };
        foundOrder.payment = formattedResponse;
        if(formattedResponse.status === "Success"){
            foundOrder.status.confirmed = true
        }

        foundOrder.save().then(data => {
            res.redirect(config.client_url + `/order/${foundOrder.order_number}/status` );
        });
    });


    // res.send(ccavResponse);


};

