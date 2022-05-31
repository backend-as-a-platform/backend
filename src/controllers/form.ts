import { Request, Response, NextFunction } from 'express';
import service from '../services/form';
import projectService from '../services/project';

class FormController {
  createForm = async (
    { params, body, currentUser }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { name, description, fields, test } = body;
      const { projectId } = params;
      // Ensure the user and project is correct
      await projectService.getProject(projectId, currentUser._id);

      res.send(
        await service.createForm({
          name,
          description,
          fields,
          test,
          project: projectId,
          active: true,
        })
      );
    } catch (err) {
      let status: number, reason: string;

      if (err.message === 'invalid-project' || err.kind === 'ObjectId') {
        status = 404;
        reason = undefined;
      } else if (err.code === 11000) {
        status = 400;
        reason = err.message;
      } else {
        status = 400;
        reason = undefined;
      }

      next({ status, reason });
    }
  };

  getForm = async (
    { params, currentUser }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { projectId, formId } = params;

      await projectService.getProject(projectId, currentUser._id);

      res.send(await service.getForm(projectId, formId));
    } catch (err) {
      next({ status: 404 });
    }
  };

  getForms = async (
    { params, currentUser }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { projectId } = params;

      await projectService.getProject(projectId, currentUser._id);

      res.send(await service.getForms(projectId));
    } catch (err) {
      console.log(err);
      next({ status: 404 });
    }
  };

  updateForm = async (
    { params, body, currentUser }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { projectId, formId } = params;
      const { name, description, fields } = body;

      await projectService.getProject(projectId, currentUser._id);

      res.send(
        await service.updateForm(projectId, formId, {
          name,
          description,
          fields,
        })
      );
    } catch (err) {
      next({
        status: err.code === 11000 ? 400 : 404,
        reason: err.message || undefined,
      });
    }
  };

  deleteForm = async (
    { params, currentUser }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { projectId, formId } = params;

      await projectService.getProject(projectId, currentUser._id);

      res.send(await service.deleteForm(projectId, formId));
    } catch (err) {
      next({ status: 404 });
    }
  };

  createRecord = async (
    { params, currentUser, body }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { projectId, formId } = params;

      await projectService.getProject(projectId, currentUser._id);

      res.send(await service.createRecord(formId, body));
    } catch (err) {
      if (
        err instanceof TypeError ||
        err.kind === 'ObjectId' ||
        err.message === 'invalid-project'
      ) {
        next({ status: 404 });
      } else {
        next({ status: 400 });
      }
    }
  };

  getRecord = async (
    { params, currentUser }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { projectId, formId, recordId } = params;

      await projectService.getProject(projectId, currentUser._id);

      res.send(await service.getRecord(formId, recordId));
    } catch (err) {
      next({ status: 404 });
    }
  };

  getRecords = async (
    { params, currentUser }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { projectId, formId } = params;

      await projectService.getProject(projectId, currentUser._id);

      res.send(await service.getRecords(formId));
    } catch (err) {
      next({ status: 404 });
    }
  };

  updateRecord = async (
    { params, currentUser, body }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { projectId, formId, recordId } = params;

      await projectService.getProject(projectId, currentUser._id);

      res.send(await service.updateRecord(formId, recordId, body));
    } catch (err) {
      console.log(err);
      if (err instanceof Error || err instanceof TypeError) {
        // TODO
        // when validation fails, 404 is thrown,
        // need to fix this.
        next({ status: 404 });
      } else {
        next({ status: 400 });
      }
    }
  };

  deleteRecord = async (
    { params, currentUser }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { projectId, formId, recordId } = params;

      await projectService.getProject(projectId, currentUser._id);

      res.send(await service.deleteRecord(formId, recordId));
    } catch (err) {
      next({ status: 404 });
    }
  };

  setFormStatus = async (
    { params, body }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res.send(
        await service.setFormStatus(
          params.projectId,
          params.formId,
          body.active
        )
      );
    } catch (err) {
      next({ status: 404 });
    }
  };
}

export default new FormController();
