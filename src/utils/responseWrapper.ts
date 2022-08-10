import { RequestHandler } from "@/interfaces/logger.interface";
import { Response } from "express";

const ResponseWrapper = (
  req: RequestHandler,
  res: Response,
  { data = null, message = null, status = 200 }
) => {
  return res.status(status).json({
    status,
    message: message ? message : req.t("successRequest"),
    data,
    path: req.path,
    requestId: req.requestId,
  });
};

export default ResponseWrapper;
