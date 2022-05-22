// import { Router } from 'express';
// import router from './';
// import auth from '../../middlewares/auth';
// import controller from '../../controllers/form';
// import { prevalidate, validateForm } from '../../middlewares/validation';

// export default (path: string, apiRouter: Router): void => {
//   const route = router(path, apiRouter);

//   /** CRUD for form schema */
//   route.get('/', auth, controller.getForms);
//   route.post('/new', auth, prevalidate, validateForm, controller.createForm);
//   route.put('/:id', auth, prevalidate, validateForm, controller.updateForm);
//   route.get('/:id', auth, controller.getForm);
//   route.delete('/:id', auth, controller.deleteForm);

//   /** CRUD for form record (entry) */
//   route.get('/:id/records', auth, controller.getRecords);
//   route.post('/:id/records/new', auth, controller.createRecord);
//   route.get('/:id/records/:recordId', auth, controller.getRecord);
//   route.put('/:id/records/:recordId', auth, controller.updateRecord);
//   route.delete('/:id/records/:recordId', auth, controller.deleteRecord);
// };
