import mongoose from "mongoose";
import logger from "./logger";

const connectDB = async (mongoURI: string) => {
	const maxRetries = 5;
	const retryDelay = 5000; // 5 seconds
	let retries = 0;

	while (retries < maxRetries) {
		try {
			const conn = await mongoose.connect(mongoURI, {
				serverSelectionTimeoutMS: 5000, // 5 seconds
				connectTimeoutMS: 10000, // 10 seconds
			});
			
			logger.info(`MongoDB Connected: ${conn.connection.host}`);
			return conn;
		} catch (error) {
			retries++;
			logger.error(`Error connecting to database (Attempt ${retries}/${maxRetries}): ${error}`);
			
			if (retries === maxRetries) {
				logger.error('Failed to connect to database after maximum retries');
				process.exit(1);
			}
			
			logger.info(`Retrying connection in ${retryDelay/1000} seconds...`);
			await new Promise(resolve => setTimeout(resolve, retryDelay));
		}
	}
};

export default connectDB;