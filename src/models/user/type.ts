import { Model, Document, LeanDocument } from 'mongoose';

// Properties
interface IUserDocument extends Document {
  firstname: string;
  middlename: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  age: number;
  avatar: Buffer;
  verificationToken: string;
  authTokens: Array<Record<string, any>>;
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
