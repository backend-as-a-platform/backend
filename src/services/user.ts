import { Document } from 'mongoose';
import { Express } from 'express';
import * as mail from '@sendgrid/mail';
import * as sharp from 'sharp';
import config from '../app/config';
import User from '../models/user';
import { IUser } from '../models/user/type';
import { throwDuplicate } from '../lib/error';

class UserService {
  createUser = async (data: Document) => {
    try {
      return await new User(data).save();
    } catch (err) {
      throwDuplicate(err);
    }
  };

  getUser = async (id: string) => {
    const user = await User.findById(id);

    if (!user) {
      throw new Error();
    }

    return user;
  };

  updateUser = async (user: IUser, newData: Record<string, any>) => {
    const updatables = [
      'firstname',
      'middlename',
      'lastname',
      'age',
      'username',
      'email',
      'password',
    ];

    try {
      updatables.forEach((key) => {
        if (newData[key] != undefined) {
          user[key] = newData[key];
        }
      });

      return await user.save();
    } catch (err) {
      throwDuplicate(err);
    }
  };

  getVerificationForUser = async (id: string) => {
    const user = await this.getUser(id);

    if (!user.verificationToken) {
      throw new Error();
    }

    const verificationToken = await user.getVerificationToken();

    return { user, verificationToken };
  };

  sendWelcomeMail = async (
    to: string,
    name: string,
    verificationToken: string
  ) => {
    const key = config('SENDGRID_API_KEY');
    const from = config('SENDGRID_VERIFIED_EMAIL');
    const hostname = config('HOSTNAME');

    mail.setApiKey(key);

    const msg = {
      from,
      to,
      subject: 'Thanks for joining',
      text: `Welcome to BaaP, ${name}.

Please verify your profile by following this link:
${hostname}/users/verify/${verificationToken}
      
Link is valid only for one hour.

Team App
      `,
    };

    await mail.send(msg);
  };

  loginUser = async (email: string, password: string) => {
    const user = await User.findByCredentials(email, password);

    if (user.verificationToken) {
      throw new Error('user is not verified');
    }

    const authToken = await user.getAuthToken();

    return { user, authToken };
  };

  logoutCurrentSession = async (user: IUser, authToken: string) => {
    user.authTokens = user.authTokens.filter(
      (token: Record<string, any>) => token.authToken !== authToken
    );

    await user.save();
  };

  logoutAllSessions = async (user: IUser) => {
    user.authTokens = [];

    await user.save();
  };

  uploadAvatar = async (user: IUser, file: Express.Multer.File) => {
    if (!file) {
      throw new Error();
    }

    const buffer = await sharp(file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    user.avatar = buffer;

    await user.save();
  };

  getAvatar = async (id: string) => {
    const user = await this.getUser(id);

    if (!user.avatar) {
      throw new Error();
    }

    return user.avatar;
  };

  deleteAvatar = async (user: IUser) => {
    if (!user.avatar) {
      throw new Error();
    }

    user.avatar = undefined;

    await user.save();
  };
}

export default new UserService();
