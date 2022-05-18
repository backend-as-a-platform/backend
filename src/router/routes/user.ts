import { Router } from 'express';
import router from './';
import auth from '../../middlewares/auth';
import controller from '../../controllers/user';
import { avatar } from '../../middlewares/upload';
import { prevalidate, validateUser } from '../../middlewares/validation';
import { uploadError } from '../../middlewares/error';

export default (path: string, apiRouter: Router): void => {
  const route = router(path, apiRouter);

  /** Route definitions */
  route.post('/signup', prevalidate, validateUser, controller.signupUser);
  route.post('/login', controller.loginUser);
  route.get('/logout', auth, controller.logoutCurrentSession);
  route.get('/logout/all', auth, controller.logoutAllSessions);
  route.get('/verify/:verificationToken', controller.verifyUser);
  route.get('/profile', auth, controller.getProfile);
  route.delete('/profile', auth, controller.deleteProfile);
  route.delete('/profile/avatar', auth, controller.deleteAvatar);
  route.get('/:id', controller.getUser);
  route.get('/:id/send-verification', controller.sendVerification);
  route.get('/:id/avatar.png', controller.getAvatar);

  route.put(
    '/profile',
    auth,
    prevalidate,
    validateUser,
    controller.updateProfile
  );

  route.post(
    '/profile/avatar',
    auth,
    avatar,
    uploadError,
    controller.uploadAvatar
  );
};
