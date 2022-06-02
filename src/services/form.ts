import { model } from 'mongoose';
import Form from '../models/form';
import Project from '../models/project';
import { IFormDocument } from '../models/form/type';
import { fieldsToMongooseSchema } from '../lib/parser';
import { throwDuplicate } from '../lib/error';
import { ValidationError } from 'joi';

export const recordModels = {};

class FormService {
  private updatables = [];

  createForm = async (
    data: Record<string, any>
  ): Promise<IFormDocument | Record<string, any>> => {
    try {
      const form = await new Form(data).save();
      /**
       * Schema for the form record.
       * It can be used to create the curresponding model
       * for managing CRUD for the form record.
       */
      const { schema, updatables } = fieldsToMongooseSchema(form.fields);

      const id = form._id.toString();

      recordModels[id] = model(`record-${id}`, schema, `record-${id}`);
      this.updatables = updatables;

      return form;
    } catch (err) {
      if (err.message === 'wont save') {
        return { validated: true };
      } else {
        if (
          err instanceof ValidationError ||
          (err.code && err.code === 11000)
        ) {
          throwDuplicate(err);
        }
      }
    }
  };

  getForm = async (
    projectId: string,
    formId: string
  ): Promise<IFormDocument> => {
    const form = await Form.findOne({ project: projectId, _id: formId });

    if (!form) {
      throw new Error();
    }

    return form;
  };

  getForms = async (projectId: string): Promise<IFormDocument[]> => {
    return await Form.find({ project: projectId });
  };

  updateForm = async (
    owner: string,
    projectId: string,
    formId: string,
    newData: Record<string, any>
  ): Promise<IFormDocument> => {
    const updatables = ['name', 'description', 'fields'];

    try {
      const project = await Project.findOne({ _id: projectId, owner });

      if (!project) {
        throw new Error('not allowed');
      }

      const form = await Form.findOne({ project: projectId, _id: formId });

      updatables.forEach((key) => {
        if (newData[key] != undefined) {
          form[key] = newData[key];
        }
      });

      return await form.save();
    } catch (err) {
      if (err.code === 11000) {
        throwDuplicate(err);
      } else {
        throw new Error();
      }
    }
  };

  shareForm = async (
    owner: string,
    projectId: string,
    formId: string,
    data: Record<string, any>
  ): Promise<IFormDocument> => {
    const { access, restrictedTo } = data;
    const project = await Project.findOne({ _id: projectId, owner });

    if (!project) {
      throw new Error('404');
    }

    const form = await Form.findOne({
      project: projectId,
      _id: formId,
    });

    if (!form) {
      throw new Error('404');
    }

    form.access = access;
    form.restrictedTo = restrictedTo;

    return await form.save();
  };

  deleteForm = async (
    owner: string,
    projectId: string,
    formId: string
  ): Promise<IFormDocument> => {
    const project = await Project.findOne({ _id: projectId, owner });

    if (!project) {
      throw new Error('not allowed');
    }

    const form = await Form.findOneAndDelete({
      project: projectId,
      _id: formId,
    });

    if (!form) {
      throw new Error();
    }

    return form;
  };

  deleteForms = async (projectId: string): Promise<Record<string, any>> => {
    const forms = await Form.find({ project: projectId });

    await Form.deleteMany({ project: projectId });

    return forms;
  };

  setFormStatus = async (
    owner: string,
    projectId: string,
    formId: string,
    active: boolean
  ): Promise<Record<string, any>> => {
    const project = await Project.findOne({ _id: projectId, owner });

    if (!project) {
      throw new Error('not allowed');
    }

    const form = await Form.findOne({ _id: formId, project: projectId });
    form['active'] = active;

    await form.save();

    return form;
  };

  createRecord = async (
    userId: string,
    formId: string,
    data: Record<string, any>
  ): Promise<Record<string, any>> => {
    const Record = recordModels[formId];
    const form = await Form.findById(formId);
    const project = await Project.findById(form.project);

    if (
      project.owner.toString() == userId ||
      form.access === 'public' ||
      (form.access === 'restrict' && form.restrictedTo.includes(userId))
    ) {
      const record = await new Record({
        ...data,
        form: formId,
      }).save();

      return record;
    }

    throw new Error('not-allowed');
  };

  getRecord = async (
    userId: string,
    formId: string,
    recordId: string
  ): Promise<Record<string, any>> => {
    const Record = recordModels[formId];
    const form = await Form.findById(formId);
    const project = await Project.findById(form.project);

    if (
      project.owner.toString() == userId ||
      form.access === 'public' ||
      (form.access === 'restrict' && form.restrictedTo.includes(userId))
    ) {
      const record = await Record.findOne({ form: formId, _id: recordId });

      return record;
    }

    throw new Error();
  };

  getRecords = async (
    userId: string,
    formId: string
  ): Promise<Record<string, any>[]> => {
    const Record = recordModels[formId];
    const form = await Form.findById(formId);
    const project = await Project.findById(form.project);

    if (project.owner.toString() == userId) {
      return await Record.find();
    }

    throw new Error();
  };

  updateRecord = async (
    userId: string,
    formId: string,
    recordId: string,
    newData: Record<string, any>
  ): Promise<Record<string, any>> => {
    const Record = recordModels[formId];
    const form = await Form.findById(formId);
    const project = await Project.findById(form.project);

    if (
      project.owner.toString() == userId ||
      form.access === 'public' ||
      (form.access === 'restrict' && form.restrictedTo.includes(userId))
    ) {
      const record = await Record.findOne({
        form: formId,
        _id: recordId,
      });

      this.updatables.forEach((key) => {
        if (newData[key] != undefined) {
          record[key] = newData[key];
        }
      });

      return await record.save();
    }

    throw new Error();
  };

  deleteRecord = async (
    userId: string,
    formId: string,
    recordId: string
  ): Promise<Record<string, any>> => {
    const Record = recordModels[formId];
    const form = await Form.findById(formId);
    const project = await Project.findById(form.project);

    if (
      project.owner.toString() == userId ||
      form.access === 'public' ||
      (form.access === 'restrict' && form.restrictedTo.includes(userId))
    ) {
      const record = await Record.findOneAndDelete({
        form: formId,
        _id: recordId,
      });

      if (!record) {
        throw new Error();
      }

      return record;
    }

    throw new Error();
  };

  deleteRecords = async (formId: string): Promise<boolean> => {
    try {
      await Form.db.dropCollection(`record-${formId}`);

      return true;
    } catch (err) {
      return false;
    }
  };
}

export default new FormService();
