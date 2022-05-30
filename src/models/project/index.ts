import { model, Schema } from 'mongoose';
import { IProjectDocument } from './type';

const schema = new Schema<IProjectDocument>({
  name: {
    type: String,
    unique: true,
  },
  description: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  access: {
    type: String,
    enum: ['public', 'private', 'restrict'],
    default: 'public',
  },
  restrictedTo: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

schema.virtual('forms', {
  ref: 'Form',
  localField: '_id',
  foreignField: 'project',
});

schema.pre('save', async function (): Promise<void> {
  if (this.access === 'public' || this.access === 'private') {
    this.restrictedTo = undefined;
  }
});

schema.methods.toJSON = function (): Record<string, any> {
  const { _id, name, description } = this;

  return { _id, name, description };
};

const Project = model('Project', schema);

export default Project;
