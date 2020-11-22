import { NextFunction, Request, Response } from 'express';

import AppError from '../errors/app.error';

function exceptionHandler(error: Error, request: Request, response: Response, next: NextFunction) {
  if (error instanceof AppError) return response.status(error.status).json({
    status: 'error',
    message: error.message,
  });

  console.error(error);

  return response.status(500).json({ statu: 'error', message: 'Internal server error' });
}

export default exceptionHandler;
