import { GraphQLError } from 'graphql';
import UserService, { CreateUserArgs } from '../../services/user';

export const resolvers = {
  Query: {
    users: async () => {
      return await UserService.getAllUsers();
    },
  },

  Mutation: {
    createUser: async (_: unknown, args: CreateUserArgs) => {
      try {
        // call the service function to create a user
        return await UserService.createUser(args);
      } catch (error: any) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'USER_CREATION_FAILED',
          },
        });
      }
    },
  },
};
