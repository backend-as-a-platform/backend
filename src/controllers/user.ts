import { Request, Response, NextFunction } from 'express';
import service from '../services/user';
import User from '../models/user';
import config from '../app/config';

/** Route controller responsible for service invocation. */
class UserController {
  getUser = async (
    { params }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = await service.getUser(params.id);

      res.send(user);
    } catch (err) {
      next({ status: 404 });
    }
  };

  getUserByEmail = async (
    { params }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = await service.getUserByEmail(params.mailId);

      res.send(user);
    } catch (err) {
      next({ status: 404 });
    }
  };

  getUsersByIds = async (
    { body }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const users = await service.getUsersByIds(body.userIds);

      res.send(users);
    } catch (err) {
      next({ status: 404 });
    }
  };

  signupUser = async (
    { body }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = await service.createUser({
        ...body,
        verificationToken: 'null',
      });

      res.redirect(`/users/${user._id}/send-verification`);
    } catch (err) {
      next({ status: 400, reason: err.message });
    }
  };

  loginUser = async (
    { body }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = body;
      const { user, authToken } = await service.loginUser(email, password);

      res.send({ user, authToken });
    } catch (err) {
      next({ status: 400, reason: err.message });
    }
  };

  verifyUser = async (
    { params }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { verificationToken } = params;

      await User.verifyUser(verificationToken);

      res.send({ result: 'verification successful, please login' });
    } catch (err) {
      next({ status: 404 });
    }
  };

  sendVerification = async (
    { params }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // For debugging only
      const isDevMode = config('NODE_ENV') === 'development';

      const { user, verificationToken } = await service.getVerificationForUser(
        params.id
      );

      isDevMode ||
        (await service.sendWelcomeMail(
          user.email,
          user.name,
          verificationToken
        ));

      res.send({
        result: `verification link has been sent to ${user.email}`,
        debug: isDevMode
          ? `${config('HOSTNAME')}/users/verify/${verificationToken}`
          : undefined,
      });
    } catch (err) {
      next({ status: 404 });
    }
  };

  logoutCurrentSession = async (
    { currentUser, authToken }: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await service.logoutCurrentSession(currentUser, authToken);

      res.send({ result: 'logged out from current session' });
    } catch (err) {
      next({ status: 400 });
    }
  };

  logoutAllSessions = async (
    { currentUser }: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await service.logoutAllSessions(currentUser);

      res.send({ result: 'logged out from all sessions' });
    } catch (err) {
      next({ status: 400 });
    }
  };

  getProfile = ({ currentUser }: Request, res: Response) => {
    res.send(currentUser);
  };

  updateProfile = async (
    { currentUser, body }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const newUser = await service.updateUser(currentUser, body);

      res.send(newUser);
    } catch (err) {
      next({ status: 400, reason: err.message });
    }
  };

  deleteProfile = async (
    { currentUser }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = await currentUser.delete();

      res.send(user);
    } catch (err) {
      next({ status: 404 });
    }
  };

  uploadAvatar = async (
    { currentUser, file }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await service.uploadAvatar(currentUser, file);

      res.send({ result: 'avatar updated' });
    } catch (err) {
      next({ status: 400, reason: 'no image provided' });
    }
  };

  getAvatar = async (
    { params }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const avatar = await service.getAvatar(params.id);

      res.set('Content-Type', 'image/png');
      res.send(avatar);
    } catch (err) {
      next({ status: 404 });
    }
  };

  deleteAvatar = async (
    { currentUser }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await service.deleteAvatar(currentUser);

      res.send({ result: 'avatar removed' });
    } catch (err) {
      next({ status: 404 });
    }
  };
}

export default new UserController();
