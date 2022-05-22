import { Document, Types } from 'mongoose';

interface IFormDocument extends Document {
  name: string;
  description: string;
  fields: Array<Record<string, any>>;
  project: Types.ObjectId;
}

export type { IFormDocument };
