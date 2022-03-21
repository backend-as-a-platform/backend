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
  const complexFields = [
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
    } else if (complexFields.includes(field.type)) {
      schema[field.name].enum = [];

      field.values.forEach(({ value }: Record<string, any>) => {
        schema[field.name].enum.push(value);
      });
    }
  });

  schema = new Schema<Document>(schema);

  return { schema, updatables };
};

export { fieldsToMongooseSchema };

/*
const testData = [
  {
    type: 'header',
    subtype: 'h1',
    label: 'Hello world',
    access: false,
  },
  {
    type: 'paragraph',
    subtype: 'p',
    label: 'This is my form',
    access: false,
  },
  {
    type: 'text',
    required: false,
    label: 'Text',
    className: 'form-control',
    name: 'text',
    access: false,
    subtype: 'text',
  },
  {
    type: 'text',
    subtype: 'email',
    required: true,
    label: 'Email',
    className: 'form-control',
    name: 'email',
    access: false,
  },
  {
    type: 'text',
    subtype: 'tel',
    required: true,
    label: 'Phone',
    className: 'form-control',
    name: 'phone',
    access: false,
  },
  {
    type: 'number',
    required: false,
    label: 'Age',
    className: 'form-control',
    name: 'age',
    access: false,
  },
  {
    type: 'textarea',
    required: false,
    label: 'Text Area',
    className: 'form-control',
    name: 'textarea',
    access: false,
    subtype: 'textarea',
  },
  {
    type: 'date',
    required: true,
    label: 'Date of Birth',
    className: 'form-control',
    name: 'dob',
    access: false,
  },
  {
    type: 'file',
    required: false,
    label: 'Photo',
    className: 'form-control',
    name: 'file',
    access: false,
    subtype: 'file',
    multiple: false,
  },
  {
    type: 'autocomplete',
    required: false,
    label: 'Autocomplete',
    className: 'form-control',
    name: 'autocomplete',
    access: false,
    requireValidOption: false,
    values: [
      {
        label: 'Option 1',
        value: 'option-1',
        selected: true,
      },
      {
        label: 'Option 2',
        value: 'option-2',
        selected: false,
      },
      {
        label: 'Option 3',
        value: 'option-3',
        selected: false,
      },
    ],
  },
  {
    type: 'select',
    required: false,
    label: 'Select',
    className: 'form-control',
    name: 'select',
    access: false,
    multiple: false,
    values: [
      {
        label: 'Option 1',
        value: 'option-1',
        selected: true,
      },
      {
        label: 'Option 2',
        value: 'option-2',
        selected: false,
      },
      {
        label: 'Option 3',
        value: 'option-3',
        selected: false,
      },
    ],
  },
  {
    type: 'checkbox-group',
    required: false,
    label: 'Checkbox Group',
    toggle: false,
    inline: false,
    name: 'checkbox',
    access: false,
    other: false,
    values: [
      {
        label: 'Option 1',
        value: 'option-1',
        selected: true,
      },
      {
        label: 'Option 2',
        value: 'option-2',
        selected: false,
      },
    ],
  },
  {
    type: 'radio-group',
    required: false,
    label: 'Radio Group',
    inline: false,
    name: 'radio',
    access: false,
    other: false,
    values: [
      {
        label: 'Option 1',
        value: 'option-1',
        selected: true,
      },
      {
        label: 'Option 2',
        value: 'option-2',
        selected: false,
      },
      {
        label: 'Option 3',
        value: 'option-3',
        selected: false,
      },
    ],
  },
];
*/
