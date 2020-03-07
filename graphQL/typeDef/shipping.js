import {gql} from 'apollo-server';

export default gql`
       
    type ShipmentQuote {
        success : Boolean ,
        duration : Float ,
        price : Float
    }   

    input Dimensions {
        length: Float,
        breadth: Float,
        height: Float
    }
       
    input ShipmentInput {
        orderID: ID!,
        addressSelected: Int! ,
        productID : ID!,
        weight: Float!,
        dimensions: Dimensions!
    }

    extend type Query {
        getShippingQuote(
            input: ShipmentInput
        ) : ShipmentQuote

        checkCoverage(
            pincode: Int
        ) : Boolean

        getShipmentDetails(
            orderID: ID!,
            productID: ID!
        ) : JSON
        
        getShipmentTrackingDetails(
            orderID: ID!,
            productID: ID!
        ) : JSON
        
    }

    extend type Mutation {
        bookShipment(
            input: ShipmentInput
        ) : String
        
        bookReturnShipment(
            orderID: ID!,
            productID: ID!
        ) : String
    }
`;