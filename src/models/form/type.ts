import { Document, Types } from 'mongoose';

interface IFormDocument extends Document {
  name: string;
  description: string;
  active: boolean;
  fields: Array<Record<string, any>>;
  test: boolean;
  project: Types.ObjectId;
  access: string;
  restrictedTo: Array<Types.ObjectId>;
  version: number;
}

export type { IFormDocument };
