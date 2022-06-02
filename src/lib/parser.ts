import { Document, Schema } from 'mongoose';

/**
 * Parser that takes an array of form fields
 * and converts to a Mongoose schema.
 * Eg. Input
 * --------
 * [{
 *   type: "text",
 *   required: false,
 *   subtype: "text",
 *   name: "text1"
 * }]
 * Eg. Output
 * {
 *   text1: {
 *     type: String,
 *     required: false
 *   }
 * }
 */
const fieldsToMongooseSchema = (
  fields: Array<Record<string, any>>
): Record<string, any> => {
  const fieldsToIgnore = ['paragraph', 'header'];
  const compositeFields = [
    'checkbox-group',
    'radio-group',
    'select',
    'autocomplete',
  ];
  const updatables = [];

  let schema: Record<string, any> = {
    form: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Form',
    },
  };

  fields.forEach((field) => {
    if (!fieldsToIgnore.includes(field.type)) {
      updatables.push(field.name);

      schema[field.name] = {
        type: String,
        required: field.required,
      };
    }

    if (field.type === 'number') {
      schema[field.name].type = Number;
    } else if (field.type === 'file') {
      schema[field.name].type = Buffer;
    } else if (compositeFields.includes(field.type)) {
      schema[field.name].enum = [];

      if (!schema[field.name].required) {
        schema[field.name].enum.push('');
      }

      field.values.forEach(({ value }: Record<string, any>) => {
        schema[field.name].enum.push(value);
      });
    }
  });

  schema = new Schema<Document>(schema);

  return { schema, updatables };
};

export { fieldsToMongooseSchema };
