import {gql} from 'apollo-server';

export default gql `
    extend type Query {
        showWishlist(user : ID): Wishlist,
        checkInWishlist(product: ID): Boolean
    }

    extend type Mutation {
        addToWishlist(product: ID): Wishlist,
        removeFromWishlist(product: ID): Wishlist 
    }
`;