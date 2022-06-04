import { Document, Schema } from 'mongoose';
import * as xlsx from 'xlsx';
import * as fs from 'fs';
import { Readable } from 'stream';
import { throwExportError } from './error';

xlsx.stream.set_readable(Readable);

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
        default: '',
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

const initXlsx = (): Record<string, any> => {
  const workBook = xlsx.utils.book_new();
  const path = '/dev/shm';
  const fileName = 'BaaP-Datasheet';

  return { workBook, path, fileName };
};

const exportToFile = async (
  formId: string,
  records: Array<Record<string, any>>,
  format: xlsx.BookType | any
): Promise<string> => {
  const supportedFormats = ['csv', 'html', 'rtf', 'txt', 'xlsx'];
  const { workBook, path, fileName } = initXlsx();
  const relFilePath = `${fileName}-${formId}.${format}`;
  const absFilePath = `${path}/${relFilePath}`;
  const sheet = xlsx.utils.json_to_sheet(records);

  xlsx.utils.book_append_sheet(workBook, sheet, fileName);

  try {
    if (format === 'json') {
      const json = JSON.stringify(records);

      fs.writeFile(absFilePath, json, () => null);

      return relFilePath;
    } else if (supportedFormats.includes(format)) {
      await xlsx.writeFileAsync(
        absFilePath,
        workBook,
        { bookType: format },
        () => null
      );

      return relFilePath;
    } else {
      throwExportError('invalid file format');
    }
  } catch (err) {
    throwExportError(err.message);
  }
};

export { fieldsToMongooseSchema, exportToFile };
