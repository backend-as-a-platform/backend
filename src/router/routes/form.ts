import { Router } from 'express';
import router from './';
import auth from '../../middlewares/auth';
import controller from '../../controllers/form';

export default (path: string, apiRouter: Router): void => {
  const route = router(path, apiRouter);

  route.get('/:formId', auth, controller.getRecords);
  route.post('/:formId', auth, controller.createRecord);
  route.get('/:formId/:recordId', auth, controller.getRecord);
  route.put('/:formId/:recordId', auth, controller.updateRecord);
  route.delete('/:formId/:recordId', auth, controller.deleteRecord);
};
