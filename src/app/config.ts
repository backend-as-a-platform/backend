import { join, resolve } from 'path';
import * as dotenv from 'dotenv';
// import { panic } from '../lib/error';

const config = (key: string): string => process.env[key];

const envFileName = '.env.' + config('NODE_ENV');
const path = join(resolve(), envFileName);
const { error } = dotenv.config({ path });

if (error) {
  // panic(`Could not find '${envFileName}' file`);
}

export default config;
