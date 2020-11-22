import { hash } from 'bcryptjs';
import { getRepository } from 'typeorm';

import AppError from '../errors/app.error';

import User from '../models/user.model';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const userAlreadyExists = await usersRepository.findOne({
      where: { email },
    });

    if (userAlreadyExists) throw new AppError('Email is already in use');

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
