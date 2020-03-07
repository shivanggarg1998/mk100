const {
    gql
} = require('apollo-server');

//getFeedProducts(username: String!): [Product]

export default gql `
    
    type UserSearchResult {
        name : String ,
        username : String
        id : String,
        image: String,
        about: String
    }
    
    type CombinedSearchResult {
        sellers : [Seller]
        users : [User] 
    }

    extend type Query {
        allUsers: [User],
        User(username: String!): User,
        checkUserNameAvailability(username: String): Boolean
        getUserAddresses : [Address]
        searchUsers(query : String!): [UserSearchResult]
        searchUsersAndSellers(query : String!): CombinedSearchResult
        getFollower(username: String!): [User]
        getFollowing(username: String!): [User]
    }
    
    input addUserAddressInput {
        address : AddressInput
    }
    
    extend type Mutation {
        followUser(
            FollowingID : ID!
        ): User,
        unFollowUser(
            FollowingID : ID!
        ): User,
        followShop(
            FollowingID : ID!
        ): Seller,
        unFollowShop(
            FollowingID : ID!
        ): Seller,
        Notify(
            UserToken : String!,
            Email : String!
        ):User,
        updateUser(
            input: UserDetailsInput
        ): User,
        addUserAddress(
            input : addUserAddressInput
        ): Address 
        changeProfileVisibility(
            public: Boolean
        ): Boolean        
    }
`

// UserDetailsInput used is defined in auth typedef