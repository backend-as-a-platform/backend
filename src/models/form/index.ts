import { model, Schema } from 'mongoose';
import { IFormDocument } from './type';
import Field from './field';

const schema = new Schema<IFormDocument>({
  name: {
    type: String,
    // unique: true,
  },
  description: String,
  fields: [Field.schema],
  test: Boolean,
  active: Boolean,
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
  },
  access: {
    type: String,
    enum: ['public', 'private', 'restrict'],
    default: 'private',
  },
  restrictedTo: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

schema.pre('save', async function (): Promise<void> {
  if (this.test) {
    // const formExists = await Form.findOne({ name: this.name });

    // if (formExists) {
    //   throw new ValidationError(
    //     'error validating: index: name',
    //     { code: 11000 },
    //     null
    //   );
    // }

    throw new Error('wont save');
  }

  this.test = undefined;

  if (this.access === 'public' || this.access === 'private') {
    this.restrictedTo = undefined;
  }
});

const Form = model('Form', schema);

export default Form;
