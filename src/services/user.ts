import { GraphQLError } from 'graphql';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { prismaClient } from '../lib/db';
import { generateToken } from '../utils/jwt';

export interface CreateUserArgs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface GetUserTokenPayload {
  email: string;
  password: string;
}

class UserService {
  // password hashing function
  private static hashPassword(password: string, salt: string): string {
    return scryptSync(password, salt, 64).toString('hex');
  }

  public static async createUser(args: CreateUserArgs) {
    const { firstName, lastName, email, password } = args;

    // validation for password length
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // password hashing
    const salt = randomBytes(32).toString('hex');
    const hashedPassword = this.hashPassword(password, salt);

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

  private static async getUserByEmail(email: string) {
    return await prismaClient.user.findUnique({ where: { email } });
  }

  public static async getUserToken(payload: GetUserTokenPayload) {
    const { email, password } = payload;
    const user = await this.getUserByEmail(email);

    // validation for user existence
    if (!user) {
      throw new GraphQLError('User not found');
    }

    // password validation
    const hashedPassword = this.hashPassword(password, user.salt);

    // timing attack mitigation (secure password comparison)
    const isValid = timingSafeEqual(
      Buffer.from(hashedPassword, 'hex'),
      Buffer.from(user.password, 'hex'),
    );

    if (!isValid) {
      throw new GraphQLError('Invalid password');
    }

    // generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return token;
  }
}

export default UserService;
