import React from "react";
import {Switch, Route, Redirect} from "react-router-dom";
import Landing from "../shop/Landing";
import Search from "../shop/Search";
import User from "../shop/Profile/User";
import Seller from "../shop/Seller/Seller";
import Cart from "../shop/Cart";
import CheckoutShipping from "../shop/Checkout/CheckoutShipping";
import UserWishlist from "../shop/Profile/UserWishlist";
import Feed from "../shop/Feed/CombinedFeed";
import Trending from "../shop/Trending/Trending";
import OrderList from "../shop/Order/OrderList";
import RequireAuth from "../utils/RequireAuth";
import TrendingFeed from "../shop/TrendingFeed";
import Chat from "../shop/Chat";
import CheckoutReview from "../shop/Checkout/CheckoutReview";
import CheckoutSubmit from "../shop/Checkout/CheckoutSubmit";
import Order from "../shop/Order/Order";
import SignupComplete from "../shop/SignupComplete";
import FacebookConnect from "../shop/FacbookConnect";
import CategoryProduct from "../shop/CategoryProduct";
import EditProfile from "../shop/Profile/EditProfile";
import OrderProduct from "../shop/Order/OrderProduct";
import EditPassword from "../shop/Profile/EditPassword";
// import Wishlist from "../shop/Wishlist";

const Router = (props) => {
    return (
        <div>
            <Switch>
                <Route exact path="/" component={() => (<Redirect to="/auth/login"/>)}/>
                <Route path="/auth" component={Landing}/>
                <Route exact path="/chat" component={RequireAuth(Chat)}/>
                <Route exact path="/facebook" component={RequireAuth(FacebookConnect)}/>
                <Route path="/category/:name/:title" component={RequireAuth(CategoryProduct)}/>
                <Route exact path="/signup/complete" component={RequireAuth(SignupComplete)}/>
                <Route exact path="/trendingfeed" component={RequireAuth(TrendingFeed)}/>
                <Route path="/search/:query/" component={RequireAuth(Search)}/>
                <Route path="/user/:id/edit" component={RequireAuth(EditProfile)}/>
                <Route path="/user/:id/password" component={RequireAuth(EditPassword)}/>
                <Route path="/user/:id" component={RequireAuth(User)}/>
                <Route path="/shop/:id/" component={RequireAuth(Seller)}/>
                <Route exact path="/cart" component={RequireAuth(Cart)}/>
                <Route path="/checkout/shipping" component={RequireAuth(CheckoutShipping)}/>
                <Route path="/checkout/review" component={RequireAuth(CheckoutReview)}/>
                <Route path="/checkout/submit" component={RequireAuth(CheckoutSubmit)}/>
                <Route exact path="/wishlist" component={RequireAuth(UserWishlist)}/>
                {/*<Route exact path="/wishlist" component={RequireAuth(Wishlist)}/>*/}
                <Route exact path="/orders" component={RequireAuth(OrderList)}/>
                <Route path="/order/:order_number/:product_id" component={RequireAuth(OrderProduct)}/>
                <Route path="/order/:order_number" component={RequireAuth(Order)}/>
                <Route path="/feed/" component={RequireAuth(Feed)}/>
                <Route path="/trending" component={RequireAuth(Trending)}/>
            </Switch>
            {console.log(props)}
        </div>
    );
};

export default Router;
