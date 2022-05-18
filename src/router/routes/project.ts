import { Router } from 'express';
import router from './';
import auth from '../../middlewares/auth';
import controller from '../../controllers/project';
import { prevalidate, validateForm } from '../../middlewares/validation';

export default (path: string, apiRouter: Router): void => {
  const route = router(path, apiRouter);

  route.get('/', auth, controller.getProjects);
  route.post('/new', auth, prevalidate, validateForm, controller.createProject);
  route.put('/:id', auth, prevalidate, validateForm, controller.updateProject);
  route.get('/:id', auth, controller.getProject);
  route.delete('/:id', auth, controller.deleteProject);
};
