import fs from 'fs';
import path from 'path';
import { getRepository } from 'typeorm';

import AppError from '../errors/app.error';

import uploadConfig from '../config/upload';

import User from '../models/user.model';

interface Request {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  private async removeExistentAvatar(avatar: string) {
    const userAvatarFilePath = path.join(uploadConfig.directory, avatar);

    const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

    if (userAvatarFileExists) await fs.promises.unlink(userAvatarFilePath);
  }

  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if (!user) throw new AppError('Only authenticated users can change their avatar.', 401);

    if (user.avatar) await this.removeExistentAvatar(user.avatar);

    user.avatar = avatarFilename;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
