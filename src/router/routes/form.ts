import { Router } from 'express';
import router from './';
import controller from '../../controllers/form';
// import { setError } from '../../helpers/error';

export default (path: string, apiRouter: Router): void => {
  const route = router(path, apiRouter);

  route.post('/new', controller.createForm);
  route.get('/:id', controller.getForm);
  route.put('/:id', controller.updateForm);
  route.delete('/:id', controller.deleteForm);
};
