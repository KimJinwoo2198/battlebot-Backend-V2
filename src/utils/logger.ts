import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import { LOG_DIR } from '@config';
import loggerModel from '@models/logger.model';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { NextFunction, Response } from 'express';
import { HttpException } from '@/exceptions/HttpException';
import { v4 as uuidv4 } from 'uuid';

// logs dir
const logDir: string = join(__dirname, LOG_DIR);

if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

// Define log format
const logFormat = winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`);

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),
  transports: [
    // debug log setting
    new winstonDaily({
      level: 'debug',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/debug', // log file /logs/debug/*.log in save
      filename: `%DATE%.log`,
      maxFiles: 30, // 30 Days saved
      json: false,
      zippedArchive: true,
    }),
    // error log setting
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/error', // log file /logs/error/*.log in save
      filename: `%DATE%.log`,
      maxFiles: 30, // 30 Days saved
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    }),
  ],
});

logger.add(
  new winston.transports.Console({
    format: winston.format.combine(winston.format.splat(), winston.format.colorize()),
  }),
);

const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};


const loggerMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const requestId = uuidv4()
    const loggerSchema = new loggerModel()
    loggerSchema.requestId = requestId;
    loggerSchema.requestBody = req.body;
    loggerSchema.requestHeders = req.headers;
    loggerSchema.requestCookies = req.cookies;
    loggerSchema.path = req.path;
    loggerSchema.method = req.method;
    loggerSchema.ip = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].toString() as string : undefined
    loggerSchema.save((err) => {
      if(err) new HttpException(500, 'Error Handler!');
    })
    req.requestId = requestId
    next();
  } catch (error) {
    next(new HttpException(500, 'Error Handler!'));
  }
};

export { logger, stream, loggerMiddleware };
