import { connect, connection } from 'mongoose';
import config from './config';
import { panic } from '../helpers/error';

const mongoDbUri = config('MONGODB_URI');

export default async (): Promise<void> => {
  try {
    await connect(mongoDbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log('MongoDB [ok] - connection successful');
  } catch (err) {
    panic(`MongoDB [error] - ${err.message}`);
  }
};

const disconnect = async (): Promise<void> => {
  await connection.close();
};

const drop = (): void => {
  connection.db.dropDatabase(() => {
    disconnect();
  });
};

export { disconnect, drop };
