import { model, Schema } from 'mongoose';
import { IFieldDocument } from './type';

const schema = new Schema<IFieldDocument>({
  _id: false,
  type: String,
  subtype: String,
  label: String,
  name: String,
  className: String,
  required: Boolean,
  requireValidOption: Boolean,
  value: String,
  values: [
    {
      _id: false,
      label: String,
      value: String,
      selected: Boolean,
    },
  ],
});

schema.pre('save', async function (): Promise<void> {
  const complexInputTypes = [
    'autocomplete',
    'select',
    'checkbox-group',
    'radio-group',
  ];

  if (complexInputTypes.includes(this.type)) {
    this.value = undefined;
  } else {
    this.values = undefined;
  }
});

const Field = model('Field', schema);

export default Field;
