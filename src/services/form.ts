import Form from '../models/form';

class FormService {
  createForm = async (data: Record<string, any>) => {
    try {
      return await new Form(data).save();
    } catch (err) {
      console.log(err);
      return { error: 'check the console' };
    }
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
