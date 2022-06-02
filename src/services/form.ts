import { model } from 'mongoose';
import Form from '../models/form';
import Project from '../models/project';
import { IFormDocument } from '../models/form/type';
import { fieldsToMongooseSchema } from '../lib/parser';
import { throwDuplicate, throwRequired } from '../lib/error';
import { ValidationError } from 'joi';

class FormService {
  private recordModels = {};
  private updatables = [];

  createForm = async (
    data: Record<string, any>
  ): Promise<IFormDocument | Record<string, any>> => {
    try {
      const form = await new Form({ ...data, version: 1 }).save();
      /**
       * Schema for the form record.
       * It can be used to create the curresponding model
       * for managing CRUD for the form record.
       */
      const { schema, updatables } = fieldsToMongooseSchema(form.fields);
      const id = form._id.toString();
      const version = form.version;

      this.recordModels[`${id}-v${version}`] = model(
        `records-${id}-v${version}`,
        schema,
        `records-${id}-v${version}`
      );
      this.updatables[`${id}-v${version}`] = updatables;

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
    const formUpdatables = ['name', 'description', 'fields'];

    try {
      const project = await Project.findOne({ _id: projectId, owner });

      if (!project) {
        throw new Error('not allowed');
      }

      const form = await Form.findOne({ project: projectId, _id: formId });

      form.version++;

      formUpdatables.forEach((key) => {
        if (newData[key] != undefined) {
          form[key] = newData[key];
        }
      });

      await form.save();

      const { schema, updatables } = fieldsToMongooseSchema(form.fields);
      const id = form._id.toString();
      const version = form.version;

      this.recordModels[`${id}-v${version}`] = model(
        `records-${id}-v${version}`,
        schema,
        `records-${id}-v${version}`
      );
      this.updatables[`${id}-v${version}`] = updatables;

      return form;
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

  getFormFields = async (
    userId: any,
    formId: string
  ): Promise<Record<string, any>> => {
    const form = await Form.findOne({ _id: formId });

    if (form.access === 'public' || form.restrictedTo.includes(userId)) {
      return form;
    } else {
      const project = await Project.findById(form.project);

      if (project.owner.toString() == userId) {
        return form;
      }
    }

    throw new Error();
  };

  createRecord = async (
    userId: string,
    formId: string,
    data: Record<string, any>
  ): Promise<Record<string, any>> => {
    try {
      const form = await Form.findById(formId);
      const Record = this.recordModels[`${formId}-v${form.version}`];
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
    } catch (err) {
      throwRequired(err);
    }
  };

  getRecord = async (
    userId: string,
    formId: string,
    recordId: string,
    version: any
  ): Promise<Record<string, any>> => {
    try {
      const form = await Form.findById(formId);
      const formVersion = version ? version * 1 : form.version;
      const Record = this.recordModels[`${formId}-v${formVersion}`];
      const project = await Project.findById(form.project);

      if (
        project.owner.toString() == userId ||
        form.access === 'public' ||
        (form.access === 'restrict' && form.restrictedTo.includes(userId))
      ) {
        const record = await Record.findOne({ form: formId, _id: recordId });

        if (!record) {
          throw new Error();
        }

        return record;
      }
    } catch (err) {
      throw new Error();
    }
  };

  getRecords = async (
    userId: string,
    formId: string,
    version: any
  ): Promise<Record<string, any>[]> => {
    const form = await Form.findById(formId);
    const formVersion = version ? version * 1 : form.version;
    const Record = this.recordModels[`${formId}-v${formVersion}`];
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
    newData: Record<string, any>,
    version: any
  ): Promise<Record<string, any>> => {
    try {
      const form = await Form.findById(formId);
      const formVersion = version ? version * 1 : form.version;
      const Record = this.recordModels[`${formId}-v${formVersion}`];
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

        this.updatables[`${formId}-v${form.version}`].forEach((key) => {
          if (newData[key] != undefined) {
            record[key] = newData[key];
          }
        });

        return await record.save();
      }
    } catch (err) {
      if (err instanceof TypeError || (err.kind && err.kind == 'ObjectId')) {
        throw { status: 404, reason: undefined };
      }

      throwRequired(err);
    }
  };

  deleteRecord = async (
    userId: string,
    formId: string,
    recordId: string,
    version: any
  ): Promise<Record<string, any>> => {
    const form = await Form.findById(formId);
    const formVersion = version ? version * 1 : form.version;
    const Record = this.recordModels[`${formId}-v${formVersion}`];
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
      const form = await Form.findById(formId);

      for (let i = 1; i <= form.version; i++) {
        await Form.db.dropCollection(`records-${formId}-v${i}`);
      }

      return true;
    } catch (err) {
      return;
    }
  };
}

export default new FormService();
