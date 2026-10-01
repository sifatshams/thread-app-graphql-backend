import { GraphQLError } from 'graphql';
import { randomBytes, scryptSync } from 'node:crypto';
import { prismaClient } from '../lib/db';

interface CreateUserArgs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const resolvers = {
  Query: {
    users: () => {
      return [
        {
          id: '1',
          name: 'Sifat',
          email: 'sifat@example.com',
        },
        {
          id: '2',
          name: 'Rahim',
          email: 'rahim@example.com',
        },
      ];
    },
  },
  Mutation: {
    createUser: async (_: unknown, args: CreateUserArgs) => {
      const { firstName, lastName, email, password } = args;

      if (password.length < 8) {
        throw new GraphQLError('Password must be at least 8 characters long');
      }

      const salt = randomBytes(16).toString('hex');
      const hashedPassword = scryptSync(password, salt, 64).toString('hex');
      try {
        await prismaClient.user.create({
          data: {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            salt,
            profileImageUrl: '',
          },
        });
        return true;
      } catch (error: any) {
        if (error.code === 'P2002') {
          throw new GraphQLError('User already exists');
        }
        throw error;
      }
    },
  },
};
