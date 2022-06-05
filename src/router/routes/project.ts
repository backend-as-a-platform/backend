import { Router } from 'express';
import router from './';
import auth from '../../middlewares/auth';
import projectController from '../../controllers/project';
import formController from '../../controllers/form';
import {
  prevalidate,
  validateProject,
  validateForm,
} from '../../middlewares/validation';

export default (path: string, apiRouter: Router): void => {
  const route = router(path, apiRouter);

  // Project routes
  route.get('/', auth, projectController.getProjects);
  route.post(
    '/new',
    auth,
    prevalidate,
    validateProject,
    projectController.createProject
  );
  route.get('/stats', auth, projectController.getStats);
  route.put(
    '/:projectId',
    auth,
    prevalidate,
    validateProject,
    projectController.updateProject
  );
  route.get('/:projectId', auth, projectController.getProject);
  route.delete('/:projectId', auth, projectController.deleteProject);
  route.post(
    '/:projectId/clone',
    auth,
    prevalidate,
    validateProject,
    projectController.cloneProject
  );
  route.post('/:projectId/status', auth, projectController.setProjectStatus);

  // Form routes
  route.get('/:projectId/forms', auth, formController.getForms);
  route.post(
    '/:projectId/forms/new',
    auth,
    prevalidate,
    validateForm,
    formController.createForm
  );
  route.put(
    '/:projectId/forms/:formId',
    auth,
    prevalidate,
    validateForm,
    formController.updateForm
  );
  route.get('/:projectId/forms/:formId', auth, formController.getForm);
  route.delete('/:projectId/forms/:formId', auth, formController.deleteForm);
  route.post('/:projectId/forms/:formId/share', auth, formController.shareForm);
  route.post(
    '/:projectId/forms/:formId/status',
    auth,
    formController.setFormStatus
  );
};
