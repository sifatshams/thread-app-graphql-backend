import { GraphQLError } from 'graphql';
import { randomBytes, scryptSync } from 'node:crypto';
import { prismaClient } from '../lib/db';

export interface CreateUserArgs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

class UserService {
  public static async createUser(args: CreateUserArgs) {
    const { firstName, lastName, email, password } = args;

    // validation for password length
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // password hashing
    const salt = randomBytes(32).toString('hex');
    const hashedPassword = scryptSync(password, salt, 64).toString('hex');

    // create user in the database
    try {
      const user = await prismaClient.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          salt,
          profileImageUrl: '',
        },
      });

      return user;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new GraphQLError('User already exists');
      }
      throw error;
    }
  }

  public static async getAllUsers() {
    return await prismaClient.user.findMany();
  }
}

export default UserService;
