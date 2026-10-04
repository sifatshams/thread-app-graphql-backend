import express from 'express';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';

import { resolvers } from './graphql/users/resolvers';
import { typeDefs } from './graphql/users/schema';
import { TokenPayload, verifyToken } from './utils/jwt';

// graphql context type interface
export interface GraphQLContext {
  user?: TokenPayload | null;
}

const app = express();

const graphqlServer = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
});

export const startGqlServer = async () => {
  await graphqlServer.start();

  app.use(express.json());

  app.use(
    '/graphql',
    expressMiddleware(graphqlServer, {
      context: async ({ req }): Promise<GraphQLContext> => {
        // http header authorization: Bearer <token>
        const authHeader = (req.headers.authorization ||
          req.headers.Authorization) as string;
        // validate
        if (authHeader) {
          const token = authHeader.startsWith('Bearer ')
            ? authHeader.split('Bearer ')[1]
            : authHeader;
          // decode the token and get the user info
          const user = verifyToken(token);
          return { user };
        }

        // if token is not provided, return null user
        return { user: null };
      },
    }),
  );
};

app.get('/', (req, res) => {
  res.json({
    message: 'Server is running...',
  });
});

export default app;
