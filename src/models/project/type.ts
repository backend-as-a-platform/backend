import { Document, ObjectId } from 'mongoose';

interface IProjectDocument extends Document {
  name: string;
  description: string;
  owner: ObjectId;
  forms: Array<ObjectId>;
}

export type { IProjectDocument };
