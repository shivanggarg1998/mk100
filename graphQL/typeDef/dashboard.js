const {gql} = require('apollo-server');

export default gql`

    type ActiveUserPayload {
        date : String ,
        users : Int
    }
    
    type RevenueDayPayload {
        date : String ,
        sales : Int
    }
    
    type ProductDayPayload {
        date : String ,
        products : Int
    }

    extend type Query {
        getActiveUsersLastWeekBySeller : [ActiveUserPayload],
        getRevenuePerWeekBySeller : [RevenueDayPayload]
        getRevenuePerWeekAdmin : [RevenueDayPayload]
        getRevenuePerMonthBySeller : [RevenueDayPayload] 
        getRevenuePerMonthAdmin : [RevenueDayPayload] 
        getProductsPerWeekBySeller : [ProductDayPayload] 
        getProductsPerWeekAdmin : [ProductDayPayload] 
    }
`;
