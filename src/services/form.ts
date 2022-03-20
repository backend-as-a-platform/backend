import { model } from 'mongoose';
import Form from '../models/form';
import { fieldsToMongooseSchema } from '../helpers/parser';

class FormService {
  private models = {};
  private updatables = [];

  createForm = async (data: Record<string, any>) => {
    const form = await new Form(data).save();
    /**
     * Schema for the form record.
     * It can be used to create the curresponding model
     * for managing CRUD for the form record.
     */
    const { schema, updatables } = fieldsToMongooseSchema(form.fields);

    const id = form._id.toString();

    this.models[id] = model(`record-${id}`, schema);
    this.updatables = updatables;

    return form;
  };

  getForm = async (id: string) => {
    const form = await Form.findById(id);

    if (!form) {
      throw new Error();
    }

    return form;
  };

  updateForm = async (id: string, newData: Record<string, any>) => {
    const updatables = ['name', 'description', 'fields'];

    const form = await Form.findById(id);

    updatables.forEach((key) => {
      if (newData[key] != undefined) {
        form[key] = newData[key];
      }
    });

    return await form.save();
  };

  deleteForm = async (id: string) => {
    const user = await Form.findOneAndDelete({ _id: id });

    if (!user) {
      throw new Error();
    }

    return user;
  };

  createRecord = async (formId: string, data: Record<string, any>) => {
    const Record = this.models[formId];

    return await new Record({
      ...data,
      form: formId,
    }).save();
  };

  getRecord = async (recordId: string, formId: string) => {
    const Record = this.models[formId];
    const record = await Record.findOne({ _id: recordId, form: formId });

    if (!record) {
      throw new Error();
    }

    return record;
  };

  updateRecord = async (
    recordId: string,
    formId: string,
    newData: Record<string, any>
  ) => {
    const Record = this.models[formId];
    const record = await Record.findOne({
      _id: recordId,
      form: formId,
    });

    if (!record) {
      throw new Error();
    }

    this.updatables.forEach((key) => {
      if (newData[key] != undefined) {
        record[key] = newData[key];
      }
    });

    return await record.save();
  };

  deleteRecord = async (recordId: string, formId: string) => {
    const Record = this.models[formId];
    const record = await Record.findOneAndDelete({
      _id: recordId,
      form: formId,
    });

    if (!record) {
      throw new Error();
    }

    return record;
  };
}

export default new FormService();
