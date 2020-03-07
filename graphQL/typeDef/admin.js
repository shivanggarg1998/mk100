import {gql} from 'apollo-server';

export default gql`
    input AdminAuthInput {
        username: String!,
        password: String!
    }

    input AdminSignupInput {
        name: String!,
        email: String!,
        username: String!,
        password: String
    }

    extend type Mutation {
        AdminSignUp(
            input: AdminSignupInput
        ): AuthPayload

        AdminLogin(
            input: AdminAuthInput
        ): AuthPayload
    }
`;