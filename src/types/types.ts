import { NextFunction, Request, Response } from "express";

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export interface Iuser {
  id: number;
  name: string;
  email: string;
}

export interface CustomRequest extends Request {
  user?: Iuser;
}
