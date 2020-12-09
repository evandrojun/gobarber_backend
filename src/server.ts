import 'reflect-metadata';

import cors from 'cors';
import express from 'express';
import 'express-async-errors';

import uploadConfig from './config/upload';

import { logRequests } from './middlewares';

import router from './router';

import './database';
import exceptionHandler from './middlewares/exception_handler.middleware';


const app = express();

app.use(cors());
app.use(express.json());
app.use(logRequests);

app.use('/files', express.static(uploadConfig.directory));

app.use(router);

app.use(exceptionHandler);

app.listen(3333, () => {
  console.clear();

  console.log('Server on: http://localhost:3333/');
  console.log('Happy Hacking!\n');
});
