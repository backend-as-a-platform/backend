import { Document, LeanDocument, Types } from 'mongoose';

interface IProjectDocument extends Document {
  name: string;
  description: string;
  active: boolean;
  owner: Types.ObjectId;
  forms: Array<Types.ObjectId>;
  access: string;
  restrictedTo: Array<Types.ObjectId>;
  toJSON(): LeanDocument<this>;
}

export type { IProjectDocument };
