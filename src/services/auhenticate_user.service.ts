import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import authConfig from '../config/auth';

import AppError from '../errors/app.error';

import User from '../models/user.model';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) throw new AppError('Invalid email or password', 401);

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) throw new AppError('Invalid email or password', 401);

    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    } as User;

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn
    });

    return { user: userWithoutPassword, token };
  }
}

export default AuthenticateUserService;
