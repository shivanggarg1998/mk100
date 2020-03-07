const mongoose = require('mongoose');

import {gql} from 'apollo-server';
import {merge} from 'lodash';

import productTypeDef from './products';
import sellerTypeDef from './sellers';
import orderTypeDef from './orders';
import authTypeDef from './auth';
import userTypeDef from './users';
import cartTypeDef from './cart';
import postTypeDef from './posts';
import feedTypeDef from './feed';
import sellerpostTypeDef from './sellerpost';
import wishlistTypeDef from './wishlist';
import adminTypeDef from './admin';
import approvalTypeDef from './approvals';
import notificationTypedef from './notifications';
import fbAuthTypedef from './fbAuth';
import dashbaordTypedef from './dashboard';
import shippingTypedef from './shipping';

// Token code
// 1 -> Successful signin/signup
// 2 -> Email already registered
// 3 -> Invalid password
// 4 -> Email not registered
// 5 -> Error occured with Facebook
// 6 -> Username already taken

const typeDefs = gql`

    scalar JSON

    type Query {
        _empty: String
    }

    type Mutation {
        _empty: String
    }

    type Comment {
        id: ID,
        text: String,
        user : User
        username : String
    }
    type Product {
        id: ID,
        name: String,
        price: Int,
        priceDistribution: PriceDistribution,
        sku: String,
        image: String,
        images : [String],
        sizes : [String],
        codAccepted : Boolean,
        returnAccepted : Boolean,
        description: String,
        keywords:[String],
        category : ProductCategory
        seller: Seller ,
        approval: Approval,
        in_my_wishlist : Boolean
    }
    
    type ProductCategory {
        name : String ,
        title : String
    }
    
    type Approval {
        approved: Boolean,
        reviewed: Boolean,
        comment: String
    }
        
    type PriceDistribution {
        base: Int,
        gst: Int,
        shipping: Int,
        reverse: Int,
        cod: Int
    }
    type Seller {
        id: ID,
        name: String,
        image: String,
        shopName: String,
        email: String,
        mobile: String,
        intro : String,
        about: String,
        website: String,
        address: [Address],
        approval:ApprovalSellers,
        legal: LegalDetails,
        policy: SellerPolicy,
        followers : [User]
    }
    type ApprovalSellers{
        approved:Boolean,
        reviewed:Boolean,
        comment:String
    }
    type UserPost {
        id: ID,
        user: User,
        product : Product,
        caption: String,
        comments :[Comment]
    }

    type Sellerpost {
        id: ID,
        seller: Seller,
        caption: String,
        image: String,
        likes : Int,
        liked_by_me : Boolean,
        comments :[Comment],
        updated_at : String
    }

    type Order {
        id: ID,
        order_number : String, 
        user: User,
        products: [OrderItem],
        discount: Int,
        total: Int,
        date: Date,
        shipping : ShippingStatus,
        status: OrderStatus,
        payment: PaymentStatus
    }

    type Cart {
        id: ID,
        items: [CartItem],
        user: User
    }

    type OrderItem {
        _id : ID ,
        product: Product,
        itemCount: Int,
        selectedSize: String
        status : OrderStatus
    }

    type CartItem {
        item: Product,
        itemCount: Int,
        selectedSize: String
    }

    type ShippingStatus {
        status : String
        address : Address
    }

    type Address {
        address : String ,
        street : String ,
        city : String ,
        state : String ,
        zipcode : Int
    }

    type PaymentStatus {
        status : String ,
        mode : String
    }

    type OrderStatus {
        confirmed:Boolean,
        packed:Boolean,
        shipped:Boolean,
        delivered:Boolean,
    }
    
    type User {
        id: ID,
        name: String,
        email:String,
        mobile: String,
        username : String,
        image: String,
        about: String,
        address: [Address],
        following: [User],
        followers: [User],
        followingShop: [Seller]
        UserToken : String,
        public: Boolean
    }
  
    type LegalDetails {
        aadhar: String,
        aadhar_image_front: String,
        aadhar_image_back: String,
        pan_image: String,
        cancelled_cheque: String,
        pan: String,
        gst: String,
        gst_document: String,
        bank: BankDetails
    }
        
    type BankDetails {
        name : String ,
        accountNumber : String ,
        ifscCode : String
    }
    
    type SellerPolicy {
        store: String,
        return: String
    }

    type Token {
        code: Int,
        content: String
    }

    type Wishlist {
        id: ID,
        user: User,
        products: [Product]
    }

    type Notification {
        id: ID,
        text: String,
        image: String,
        action: String,
        to: [User],
        readBy: [User]
    }

    input AddressInput {
        address: String,
        street: String,
        city: String,
        state: String,
        zipcode: Int
    }

    scalar Date
`;

module.exports = [typeDefs, dashbaordTypedef, productTypeDef, sellerTypeDef, orderTypeDef, authTypeDef, userTypeDef, cartTypeDef, postTypeDef, feedTypeDef, sellerpostTypeDef, wishlistTypeDef, adminTypeDef, approvalTypeDef, notificationTypedef, fbAuthTypedef, shippingTypedef];
