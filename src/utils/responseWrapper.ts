import { RequestHandler } from '@/interfaces/logger.interface';
import { Response } from 'express';

const ResponseWrapper = (req: RequestHandler, res: Response, { data = null, message = '요청을 성공적으로 실행했습니다.', status = 200 }) => {
  return res.status(status).json({ status, message, data, path: req.path, requestId: req.requestId });
};

export default ResponseWrapper;
