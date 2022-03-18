import { Document, LeanDocument } from 'mongoose';

interface IFieldDocument extends Document {
  type: string;
  subtype: string;
  label: string;
  name: string;
  className: string;
  required: boolean;
  requireValidOption: boolean;
  value: string;
  values: Array<Record<string, any>>;
  toJSON(): LeanDocument<this>;
}

export type { IFieldDocument };
