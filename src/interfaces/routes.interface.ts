import { Router } from 'express';

export interface Routes {
  path?: string;
  router: Router;
}

export interface ResponseObj {
  data?: any,
  message: string
}