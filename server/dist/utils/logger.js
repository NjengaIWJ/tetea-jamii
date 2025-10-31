"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestMiddleWare = exports.winstonLog = void 0;
const winston_1 = require("winston");
const express_winston_1 = __importDefault(require("express-winston"));
const uuid_1 = require("uuid");
const logger = (0, winston_1.createLogger)({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.json()),
    transports: [
        new winston_1.transports.Console()
    ],
    exitOnError: false
});
exports.default = logger;
exports.winstonLog = express_winston_1.default.logger({
    winstonInstance: logger,
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: false,
});
const requestMiddleWare = (req, res, next) => {
    const requestId = (0, uuid_1.v4)();
    req.headers['X-Request-ID'] = requestId;
    req.requestId = requestId;
    res.setHeader('X-Request-ID', requestId);
    next();
};
exports.requestMiddleWare = requestMiddleWare;
//# sourceMappingURL=logger.js.map