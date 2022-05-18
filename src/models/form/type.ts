import { Document, ObjectId } from 'mongoose';

interface IFormDocument extends Document {
  name: string;
  description: string;
  fields: Array<Record<string, any>>;
  project: ObjectId;
}

export type { IFormDocument };
