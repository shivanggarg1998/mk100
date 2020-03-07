import {gql} from 'apollo-server';

export default gql`
    extend type Query {
        allSellers: [Seller],
        Seller(shopName: String!): Seller,
        getSeller: Seller,
        getSellers(ids : [ID]): [Seller],
        checkShopnameAvailability(shopName: String): Boolean,
        getSellerAddress: [Address],
        getTopSellers: [Seller],
        getSellerStats: SellerStats,
        getSellerFollowers: [User],
        checkEmailAvailability(email:String):Boolean,
    }

    type SellerStats {
        products: Int,
        followers: Int,
        posts: Int
    }

    input SellerInput {
        name: String,
        image: String,
        shopName : String,
        password : String,
        email : String,
        mobile : String,
        about: String,
        intro : String,
        website: String,
        address: AddressInput,
        legal: LegalDetailsInput,
        policy: SellerPolicyInput
    }

    input UnapprovedInput {
        name: String,
        image: Upload,
        shopName : String,
        mobile : String,
        about: String,
        intro : String,
        website: String,
        address: AddressInput,
        legal: LegalDetailsInput,
        policy: SellerPolicyInput
    }

    input UpdateSellerInput {
        name: String,
        image: Upload,
        mobile : String,
        about: String,
        intro : String,
    }

    input LegalDetailsInput {
        aadhar: String,
        aadhar_image_front: String,
        aadhar_image_back: String,
        pan_image: String,
        cancelled_cheque: String,
        pan: String,
        gst: String,
        gst_document: String,
        bank: BankDetailsInput
    }
    
    input BankDetailsInput {
        name : String ,
        accountNumber : String ,
        ifscCode : String 
    }
    
    input SellerPolicyInput {
        store: String!,
        return: String!
    }
    
    input AddSellerAddressInput {
        address : AddressInput
    }

    input SellerAuthInput {
        shopName: String!
        password: String!
    }

    extend type Mutation {
        addSeller(
            input: SellerInput
        ): Seller,

        updateSeller(
            input: UpdateSellerInput!
        ): Seller,

        removeSeller(
            sellerID: ID!
        ): Seller

        SellerLogin(
            input: SellerAuthInput
        ) : AuthPayload
        
        addSellerAddress(
            input: AddSellerAddressInput 
        ) : Address
        
        ChangePasswordSeller(
            oldPassword: String!,
            newPassword: String!
        ) : JSON

        ForgotPasswordSeller(
            shopName: String!
        ) : JSON
        
        sendQueryToAdmin(
            message : String!,
            subject : String!
        ) : Boolean

        unapprovedLogin(
            shopName: String!,
            password: String!
        ) : Seller

        unapprovedUpdate(
            input: UnapprovedInput
        ) : Seller
    }
`;
