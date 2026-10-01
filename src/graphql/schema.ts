export const typeDefs = `#graphql
    type User {
        id: ID!
        name: String!
        email: String!
    }

    type Query {
        users: [User!]!
    }

    type Mutation {
        createUser(firstName: String!, lastName: String!, email: String!, password: String!): User!
    }
`