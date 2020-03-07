const { gql } = require('apollo-server');

export default gql`

    input AddUserPostInput {
        product : ID!,
        caption: String
    }

    input UpdateUserPost {
        postID: ID!,
        caption: String!
    }
    
    extend type Query {
        getUserPosts : [UserPost]
        UserPosts(username: String!) : [UserPost]
    }
    
    extend type Mutation {
        addUserPost(
            input: AddUserPostInput
        ) : UserPost,

        updateUserPost(
            input: UpdateUserPost
        ): UserPost,

        deleteUserPost(
            postID: ID!
        ): Boolean
    }
`;