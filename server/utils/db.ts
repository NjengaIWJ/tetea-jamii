import mongoose from "mongoose";
import logger from "./logger";

const connectDB = async (mongoURI: string) => {
	try {
    const conn = await mongoose.connect(mongoURI);
		logger.info(`MongoDB Connected: ${conn.connection.host}`);

    return conn;
	} catch (error) {
		logger.error(`Error connecting to database: ${error}`);
		process.exit(1);
	}
};

export default connectDB;