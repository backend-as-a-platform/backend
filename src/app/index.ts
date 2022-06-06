import * as express from 'express';
import * as cors from 'cors';
// import config from './config';
import api from '../router/api';
import error from '../middlewares/error';

const app = express();
// const corsOrigin = cors({ origin: config('FRONTEND_URI') });
const corsOrigin = cors({ origin: '*' });

app.use(express.json());
app.use(corsOrigin);
app.use(api());
app.use(error());

export default app;
