import {gql} from 'apollo-server';

module.exports = gql`

    input FBInput {
        accessToken: String,
        userID: String,
    }

    extend type Query {
        fbFriends(
            input: FBInput
        ): [User]
    }

    extend type Mutation {
        fbSignup(
            input: FBInput
        ): AuthPayload
        fbSignin(
            input: FBInput
        ): AuthPayload
        followFBFriends(
            ids: [ID]!
        ): Boolean
    }
`;