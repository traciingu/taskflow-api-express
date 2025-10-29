import createHttpError from 'http-errors';
import express from 'express';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import { Server } from 'node:http';
import type { AddressInfo } from 'node:net';

let connection: Server;

export const startServer = (): Promise<AddressInfo> => {
  return new Promise<AddressInfo>((resolve, reject) => {
    const app = express();
    const PORT = process.env.PORT;

    defineRoutes(app);
    connection = app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
      resolve(connection!.address() as AddressInfo);
    });
  });
};

export const stopServer = async () => {
  return new Promise<void>((resolve, reject) => {
    if (connection) {
      connection.close(() => resolve());
    }

    return resolve();
  });
};

const defineRoutes = (app: express.Application) => {

  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(import.meta.dirname, 'public')));

  app.use('/', indexRouter);
  app.use('/users', usersRouter);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createHttpError(404));
  });

  // error handler
  app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

}
