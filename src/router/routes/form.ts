import { Router } from 'express';
import router from './';
import auth from '../../middlewares/auth';
import controller from '../../controllers/form';

export default (path: string, apiRouter: Router): void => {
  const route = router(path, apiRouter);

  route.post('/:formId', auth, controller.createRecord);
  route.get('/:formId', auth, controller.getRecords);
  route.get('/:formId/v/:version', auth, controller.getRecords);
  route.get('/:formId/fields', auth, controller.getFormFields);
  route.get('/:formId/:recordId', auth, controller.getRecord);
  route.get('/:formId/v/:version/:recordId', auth, controller.getRecord);
  route.put('/:formId/:recordId', auth, controller.updateRecord);
  route.put('/:formId/v/:version/:recordId', auth, controller.updateRecord);
  route.delete('/:formId/:recordId', auth, controller.deleteRecord);
  route.delete('/:formId/v/:version/:recordId', auth, controller.deleteRecord);
};
