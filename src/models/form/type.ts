import { Document } from 'mongoose';

interface IFormDocument extends Document {
  name: string;
  description: string;
  fields: Array<Record<string, any>>;
}

export type { IFormDocument };
