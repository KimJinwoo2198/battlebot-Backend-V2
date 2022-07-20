import { Request } from "express";

export interface Log {
  _id: string;
  requestId: string;
  path: string;
  method: string;
  error?: any;
  request: String;
  requestBody: Object,
  requestHeders: Object,
  requestCookies: Object,
}

export interface RequestHandler extends Request {
  requestId: string;
}

