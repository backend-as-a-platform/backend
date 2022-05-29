import { Document, Types } from 'mongoose';

interface IFormDocument extends Document {
  name: string;
  description: string;
  fields: Array<Record<string, any>>;
  test: boolean;
  project: Types.ObjectId;
}

export type { IFormDocument };
