"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.createApiError = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const createApiError = (message, statusCode = 500, code, details) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.code = code;
    error.details = details;
    return error;
};
exports.createApiError = createApiError;
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const errorResponse = {
        error: {
            message: err.message || 'Internal Server Error',
            code: err.code || 'INTERNAL_ERROR',
            ...(process.env.NODE_ENV === 'development' && {
                details: err.details || err.stack,
            }),
        },
    };
    logger_1.default.error(err.stack || err.message, {
        error: err,
        route: req.path,
        method: req.method,
        statusCode,
    });
    res.status(statusCode).json(errorResponse);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map