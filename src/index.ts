import app from './app';
import config from './app/config';
import connect from './app/db';
import { panic } from './lib/error';

const port = config('PORT');
const host = config('HOSTNAME');

connect();

app
  .listen(port, (): void => {
    console.log(`Server  [ok] - ${host}`);
  })
  .on('error', (err: string) => {
    panic(err);
  });
