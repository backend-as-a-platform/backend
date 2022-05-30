import { Model, Document, LeanDocument, ObjectId } from 'mongoose';

// Properties
interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  avatar: Buffer;
  verificationToken: string;
  authTokens: Array<Record<string, any>>;
  projects: Array<ObjectId>;
  accessibleProjects: Array<ObjectId>;
}

// Methods
interface IUser extends IUserDocument {
  toJSON(): LeanDocument<this>;
  getAuthToken(): Promise<string>;
  getVerificationToken(): Promise<string>;
}

// Statics
interface IUserModel extends Model<IUser> {
  findByCredentials: (email: string, password: string) => Promise<IUser>;
  verifyUser: (verificationToken: string) => Promise<void>;
}

export type { IUser, IUserDocument, IUserModel };
