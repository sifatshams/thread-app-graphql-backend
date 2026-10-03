export const typeDefs = `#graphql
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    profileImageUrl: String
  }

  type Query {
    users: [User!]!
  }

  type Mutation {
    createUser(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
    ): User!

    getUserToken(email: String!, password: String!): String!
  }
`;
