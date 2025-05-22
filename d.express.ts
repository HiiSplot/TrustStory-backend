import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Remplace 'any' par le type de ton utilisateur si tu veux
    }
  }
}
