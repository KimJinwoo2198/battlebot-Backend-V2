import ResponseWrapper from '@/utils/responseWrapper';
import { NextFunction, Request, Response } from 'express';

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction) => {
    try {
      ResponseWrapper(req, res, {data: {"hello": "world"}})
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
