import { Router } from 'express';
import router from './';
import controller from '../../controllers/form';

export default (path: string, apiRouter: Router): void => {
  const route = router(path, apiRouter);

  /** CRUD for form schema */
  route.post('/new', controller.createForm);
  route.get('/:id', controller.getForm);
  route.put('/:id', controller.updateForm);
  route.delete('/:id', controller.deleteForm);

  /** CRUD for form record (entry) */
  route.post('/:id/records/new', controller.createRecord);
  route.get('/:id/records/:recordId', controller.getRecord);
  route.put('/:id/records/:recordId', controller.updateRecord);
  route.delete('/:id/records/:recordId', controller.deleteRecord);
};
