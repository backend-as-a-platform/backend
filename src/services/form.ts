import Form from '../models/form';
import { fieldsToMongooseSchema } from '../helpers/parser';

class FormService {
  createForm = async (data: Record<string, any>) => {
    const form = await new Form(data).save();
    /**
     * Schema for the form record.
     * It can be used to create the curresponding model
     * for managing CRUD for form record.
     */
    const recordSchema = fieldsToMongooseSchema(form.fields);

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
}

export default new FormService();
