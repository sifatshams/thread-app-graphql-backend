import express from 'express';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';

import { resolvers } from './graphql/users/resolvers';
import { typeDefs } from './graphql/users/schema';

const app = express();

const graphqlServer = new ApolloServer({
  typeDefs,
  resolvers,
});

export const startGqlServer = async () => {
  await graphqlServer.start();

  app.use(express.json());

  app.use('/graphql', expressMiddleware(graphqlServer));
};

app.get('/', (req, res) => {
  res.json({
    message: 'Server is running...',
  });
});

export default app;
