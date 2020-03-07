const { gql } = require('apollo-server');

export default gql`

    extend type Query {
        allSellerpost: [Sellerpost]
        getSellerPostByID(id:ID):Sellerpost
        getSellerPostBySeller(id : ID) : [Sellerpost]
        getSellerPostByFeed(id : ID) : [FeedType]
    }
        
    extend type Mutation {
        addNewPostSeller(
            file: Upload!,
            caption:String!,
        ) : Boolean      
        updatePostSeller(
            file: Upload,
            caption:String!,
            id:ID,
        ) : Boolean 
        removeSellerPost(
            id: ID!
        ) : Boolean
    }
`;