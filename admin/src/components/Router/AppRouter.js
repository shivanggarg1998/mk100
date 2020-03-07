import React from "react";
import { Switch, Route } from "react-router-dom";

import Dashboard from "../Dashboard";
import Seller from "../Seller";
import User from "../User";
import Order from "../Order";
import AllSeller from "../AllSellers"
import Product from "../Product";
import ProductApproval from "../ProductApproval";
import SellerApproval from "../SellerApproval";

const Router = () => {
    return (
        <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/users" component={User} />
            <Route exact path="/sellers" component={AllSeller} />
            <Route exact path="/orders" component={Order} />
            <Route exact path="/products" component={Product} />
            <Route exact path="/approval/products" component={ProductApproval} />
            <Route exact path="/approval/sellers" component={SellerApproval} />
            
        </Switch>
    );
};

export default Router;
