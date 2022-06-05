import { Request, Response, NextFunction } from 'express';
import service from '../services/form';
import projectService from '../services/project';
import { exportToFile } from '../lib/parser';

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

      res.send(
        await service.updateForm(currentUser._id, projectId, formId, {
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

  shareForm = async (
    { params, body, currentUser }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { projectId, formId } = params;
      const { access, restrictedTo } = body;

      res.send(
        await service.shareForm(currentUser._id, projectId, formId, {
          access,
          restrictedTo,
        })
      );
    } catch (err) {
      next({ status: 404 });
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

      res.send(await service.deleteForm(currentUser._id, projectId, formId));
    } catch (err) {
      next({ status: 404 });
    }
  };

  setFormStatus = async (
    { params, body, currentUser }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res.send(
        await service.setFormStatus(
          currentUser._id,
          params.projectId,
          params.formId,
          body.active
        )
      );
    } catch (err) {
      next({ status: 404 });
    }
  };

  getFormFields = async (
    { params, currentUser }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { formId } = params;

    try {
      res.send(await service.getFormInfo(currentUser._id, formId));
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
      const { formId } = params;

      res.send(await service.createRecord(currentUser._id, formId, body));
    } catch (err) {
      next({ status: 400, reason: err.message });
    }
  };

  getRecord = async (
    { params, currentUser }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { formId, recordId, version } = params;

      res.send(
        await service.getRecord(currentUser._id, formId, recordId, version)
      );
    } catch (err) {
      next({ status: 404 });
    }
  };

  getRecords = async (
    { params, currentUser, query }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { formId, version } = params;
      const { format } = query;

      const records = await service.getRecords(
        currentUser._id,
        formId,
        version
      );

      if (format) {
        const rows = records.map((record) => {
          const recordCopy = { ...record._doc };

          delete recordCopy._id;
          delete recordCopy.form;
          delete recordCopy.__v;

          return recordCopy;
        });

        const file = await exportToFile(formId, rows, format);

        if (file) {
          res.send({ file });
        }
      } else {
        res.send(records);
      }
    } catch (err) {
      if (err.type && err.type === 'export') {
        next({ status: 400, reason: err.message });
      }

      next({ status: 404 });
    }
  };

  downloadFile = async (
    { query }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { file } = query;

      res.download(`/dev/shm/${file.toString().split('/').join('')}`);
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
      const { formId, recordId, version } = params;

      res.send(
        await service.updateRecord(
          currentUser._id,
          formId,
          recordId,
          body,
          version
        )
      );
    } catch (err) {
      next({ status: err.status, reason: err.reason });
    }
  };

  deleteRecord = async (
    { params, currentUser }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { formId, recordId, version } = params;

      res.send(
        await service.deleteRecord(currentUser._id, formId, recordId, version)
      );
    } catch (err) {
      next({ status: 404 });
    }
  };
}

export default new FormController();
