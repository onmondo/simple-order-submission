import { Request, Response } from 'express';

export const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

// export const errorHandler = (err: Error, _req: Request, res: Response, next: NextFunction) => {
//   console.error(err.message);

//   if (err.name === 'CastError') {
//     return res.status(400).send({ error: 'malformatted id' });
//   } else if (err.name === 'ValidationError') {
//     return res.status(400).send({ error: err.message });
//   } else if (err.name === 'JsonWebTokenError') {
//     return res.status(401).json({ error: 'token invalid' });
//   } else if (err.name === 'TokenExpiredError') {
//     return res.status(401).json({ error: 'token expired' });
//   }

//   next(err);
// };
