import { createLogger, format, transports } from "winston";
import expressWinston from 'express-winston';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from "uuid";

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console()
  ],
  exitOnError: false
})

export default logger;

export const winstonLog = expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
});

export const requestMiddleWare = (req: Request, res: Response, next: NextFunction) => {
  const requestId = uuidv4();
  req.headers['X-Request-ID'] = requestId;
  (req as any).requestId = requestId;

  res.setHeader('X-Request-ID', requestId);

 next()
}