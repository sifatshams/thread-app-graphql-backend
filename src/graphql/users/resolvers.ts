import { GraphQLError } from 'graphql';
import { GraphQLContext } from '../../app';
import UserService, {
  CreateUserArgs,
  GetUserTokenPayload,
} from '../../services/user';

export const resolvers = {
  Query: {
    users: async () => {
      return await UserService.getAllUsers();
    },

    // logged in user query resolver
    getCurrentLoggedInUser: async (
      _: unknown,
      __: unknown,
      context: GraphQLContext,
    ) => {
      // if user context is not provided, throw an error
      if (!context.user) {
        throw new GraphQLError('User not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // users main data from db with context user id
      const loggedInUser = await UserService.getUserById(context.user.userId);
      return loggedInUser;
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

    getUserToken: async (_: unknown, args: GetUserTokenPayload) => {
      try {
        return await UserService.getUserToken(args);
      } catch (error: any) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'USER_TOKEN_GENERATION_FAILED',
          },
        });
      }
    },
  },
};
