import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

export function validateRequest(dtoClass: ClassConstructor<object>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToInstance(dtoClass, req.body);
    const errors = await validate(dtoObject as any);
    if (errors.length > 0) {
      const messages = errors
        .map((err) => Object.values(err.constraints || {}))
        .flat();
      return res.status(400).json({ message: 'Validation failed', errors: messages });
    }
    next();
  };
}
