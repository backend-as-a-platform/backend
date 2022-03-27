import { model, Schema } from 'mongoose';
import { IFormDocument } from './type';
import Field from './field';

const schema = new Schema<IFormDocument>({
  name: {
    type: String,
    unique: true,
  },
  description: String,
  fields: [Field.schema],
});

const Form = model('Form', schema);

export default Form;
