"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./logger"));
const connectDB = async (mongoURI) => {
    try {
        const conn = await mongoose_1.default.connect(mongoURI);
        logger_1.default.info(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    }
    catch (error) {
        logger_1.default.error(`Error connecting to database: ${error}`);
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map