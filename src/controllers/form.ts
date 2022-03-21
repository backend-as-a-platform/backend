import { Request, Response, NextFunction } from 'express';
import service from '../services/form';

class FormController {
  createForm = async (
    { body }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { name, description, fields } = body;

      res.send(await service.createForm({ name, description, fields }));
    } catch (err) {
      next({ status: 400 });
    }
  };

  getForm = async (
    { params }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res.send(await service.getForm(params.id));
    } catch (err) {
      next({ status: 404 });
    }
  };

  updateForm = async (
    { params, body }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = params;
      const { name, description, fields } = body;

      res.send(await service.updateForm(id, { name, description, fields }));
    } catch (err) {
      next({ status: 404 });
    }
  };

  deleteForm = async (
    { params }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = params;

      res.send(await service.deleteForm(id));
    } catch (err) {
      next({ status: 404 });
    }
  };

  createRecord = async (
    { params, body }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = params;

      res.send(await service.createRecord(id, body));
    } catch (err) {
      if (err instanceof TypeError) {
        next({ status: 404 });
      } else {
        next({ status: 400 });
      }
    }
  };

  getRecord = async (
    { params }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id, recordId } = params;

      res.send(await service.getRecord(recordId, id));
    } catch (err) {
      next({ status: 404 });
    }
  };

  updateRecord = async (
    { params, body }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id, recordId } = params;

      res.send(await service.updateRecord(recordId, id, body));
    } catch (err) {
      if (err instanceof Error || err instanceof TypeError) {
        // when validation fails, 404 is thrown,
        // need to fix this.
        next({ status: 404 });
      } else {
        next({ status: 400 });
      }
    }
  };

  deleteRecord = async (
    { params }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id, recordId } = params;

      res.send(await service.deleteRecord(recordId, id));
    } catch (err) {
      next({ status: 404 });
    }
  };
}

export default new FormController();
