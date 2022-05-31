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

  // Project CRUD
  route.get('/', auth, projectController.getProjects);
  route.post(
    '/new',
    auth,
    prevalidate,
    validateProject,
    projectController.createProject
  );
  route.put(
    '/:projectId',
    auth,
    prevalidate,
    validateProject,
    projectController.updateProject
  );
  route.get('/:projectId', auth, projectController.getProject);
  route.delete('/:projectId', auth, projectController.deleteProject);
  route.post('/:projectId/status', auth, projectController.setProjectStatus);

  // Form CRUD
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

  // Form record (entry) CRUD
  route.get(
    '/:projectId/forms/:formId/records',
    auth,
    formController.getRecords
  );
  route.post(
    '/:projectId/forms/:formId/records/new',
    auth,
    formController.createRecord
  );
  route.get(
    '/:projectId/forms/:formId/records/:recordId',
    auth,
    formController.getRecord
  );
  route.put(
    '/:projectId/forms/:formId/records/:recordId',
    auth,
    formController.updateRecord
  );
  route.delete(
    '/:projectId/forms/:formId/records/:recordId',
    auth,
    formController.deleteRecord
  );
  route.post(
    '/:projectId/forms/:formId/status',
    auth,
    formController.setFormStatus
  );
};
