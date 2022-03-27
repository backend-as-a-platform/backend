import * as express from 'express';
import * as cors from 'cors';
import api from '../router/api';
import error from '../middlewares/error';
import config from './config';

const app = express();
const corsOrigin = cors({ origin: config('FRONTEND_URI') });

app.use(express.json());
app.use(corsOrigin);
app.use(api());
app.use(error());

export default app;
