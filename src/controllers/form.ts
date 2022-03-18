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
}

export default new FormController();
