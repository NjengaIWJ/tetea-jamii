"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./logger"));
const connectDB = async (mongoURI) => {
    const maxRetries = 5;
    const retryDelay = 5000; // 5 seconds
    let retries = 0;
    while (retries < maxRetries) {
        try {
            const conn = await mongoose_1.default.connect(mongoURI, {
                serverSelectionTimeoutMS: 5000, // 5 seconds
                connectTimeoutMS: 10000, // 10 seconds
            });
            logger_1.default.info(`MongoDB Connected: ${conn.connection.host}`);
            return conn;
        }
        catch (error) {
            retries++;
            logger_1.default.error(`Error connecting to database (Attempt ${retries}/${maxRetries}): ${error}`);
            if (retries === maxRetries) {
                logger_1.default.error('Failed to connect to database after maximum retries');
                process.exit(1);
            }
            logger_1.default.info(`Retrying connection in ${retryDelay / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map