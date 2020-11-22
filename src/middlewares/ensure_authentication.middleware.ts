import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../config/auth';

import AppError from '../errors/app.error';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

function ensureAuthentication(request: Request, response: Response, next: NextFunction): void {
  const jwt = request.headers.authorization;

  if (!jwt) throw new Error('JWT is missing');

  const [, token] = jwt.split(' ');

  try {
    const { sub } = verify(token, authConfig.jwt.secret) as TokenPayload;

    request.user = { id: sub };

    return next();
  } catch (error) {
    throw new AppError('Invalid or expired JWT', 401);
  }
}

export default ensureAuthentication;
