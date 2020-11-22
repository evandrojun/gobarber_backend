import { NextFunction, Request, Response } from 'express';

function logRequests(request: Request, response: Response, next: NextFunction) {
  const { method, url } = request;

  const logRequest = `[${method.toUpperCase()}] ${url}`;

  console.time(logRequest);

  next();

  console.timeEnd(logRequest);
}

export default logRequests;
