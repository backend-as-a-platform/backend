import { Router } from 'express';
import router from './';
import controller from '../../controllers/form';
import { prevalidate, validateForm } from '../../middlewares/validation';

export default (path: string, apiRouter: Router): void => {
  const route = router(path, apiRouter);

  /** CRUD for form schema */
  route.get('/', controller.getForms);
  route.post('/new', prevalidate, validateForm, controller.createForm);
  route.put('/:id', prevalidate, validateForm, controller.updateForm);
  route.get('/:id', controller.getForm);
  route.delete('/:id', controller.deleteForm);

  /** CRUD for form record (entry) */
  route.get('/:id/records', controller.getRecords);
  route.post('/:id/records/new', controller.createRecord);
  route.get('/:id/records/:recordId', controller.getRecord);
  route.put('/:id/records/:recordId', controller.updateRecord);
  route.delete('/:id/records/:recordId', controller.deleteRecord);
};
