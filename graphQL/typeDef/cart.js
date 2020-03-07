const { gql } = require('apollo-server');

export default gql`

    input AddToCartInput {
        productID: ID!,
        itemCount: Int!,
        selectedSize: String
    }

    input RemoveFromCartInput {
        index: Int      
    }

    extend type Query {
        getCart : Cart
    }

    extend type Mutation {
        addToCart(
            input: AddToCartInput
        ) : Cart,

        removeFromCart(
            input: RemoveFromCartInput
        ) : Cart
    }
`;