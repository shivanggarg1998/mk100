const { gql } = require('apollo-server');

export default gql`

    union FeedOrigin = UserPost | Product | Sellerpost
    
    type FeedType {
        origin : FeedOrigin ,
        refString : String ,
        created_at : String ,
        updated_at : String ,
        event : String 
        id : ID 
    }
    
    
    extend type Query {
        getFeed : [FeedType]
        getFeedItem(id : ID!) : FeedType
    }
    
    input addCommentInput {
        post : ID! ,
        comment : String! ,
        mentions : [String],
        parentFeedId : ID!
    }
    input addLikeInput {
        post : ID! 
    }
    input removeLikeInput {
        post : ID!
    }
    
    extend type Mutation {
        addSellerComment(
            input : addCommentInput
        ):Sellerpost,
        addSellerPostLike(
            input : addLikeInput
        ):Sellerpost,
        removeSellerPostLike(
            input : removeLikeInput
        ):Sellerpost,
        addUserPostComment(
            input : addCommentInput
        ):UserPost,
        addUserPostLike(
            input : addLikeInput
        ):UserPost,
        removeUserPostLike(
            input : removeLikeInput
        ):UserPost
    }
    
`;