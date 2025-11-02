import * as dotenv from 'dotenv';
dotenv.config()

import express, { type Request, type Response } from "express";
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from "cors";

import { envConfig } from './config/env.config';
import passport from './middleware/passport';
import connectDB from './utils/db';
import { formParser } from './middleware/multer';
import sender from './utils/mailer';
import adminRouter from './routes/admin.routes';
import articlesRouter from './routes/articles.routes';
import partnerRouter from './routes/partners.routes';
import documentRouter from './routes/document.routes';
import logger, { requestMiddleWare, winstonLog } from './utils/logger';

const { PORT, frontendURL, mongoUri } = envConfig
logger.info(`Environment Variables - PORT: ${PORT}, frontendURL: ${frontendURL}, mongoUri: ${mongoUri ? 'Provided' : 'Not Provided'}`);

const app = express()

const corsOptions = {
	origin: frontendURL,
	credentials: true,
	allowedHeaders: [
		"Content-Type",
		"Authorization",
		"X-Requested-With",
		"Accept",
		"Origin",
		"Origin",
		"Access-Control-Allow-Origin",
		"access-control-allow-origin"
	],
	methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
	optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Parse cookies (required for cookie-based auth)
app.use(cookieParser());

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(passport.initialize());
app.use(helmet());

app.use(winstonLog)
app.use(requestMiddleWare)

app.get("/", (req: Request, res: Response) => {
	res.send("API is running...");
});

(async () => {
	if (mongoUri) {
		try {
			await connectDB(mongoUri)

			logger.info(`Connected to the database successfully.`)
		} catch (err) {
			logger.error("Failed to connect to the database:", err);
			process.exit(1);
		}
	} else {
		logger.warn("Skipping DB connect because mongoUri is empty.");
	}
})()

app.use("/api/sendEmail", formParser, sender);
app.use("/api", articlesRouter);
app.use("/api", partnerRouter);
app.use("/api", documentRouter);
app.use("/api", adminRouter);

app.use((err: Error, req: Request, res: Response, next: Function) => {
	logger.error(err.stack || err.message, { error: err, route: req.path, method: req.method }

	)
	res.status(500).send({ message: err.message });
});

app.use((req: Request, res: Response) => {
	logger.warn(`404 Not Found - ${req.method} ${req.url}`, { route: req.path, method: req.method });
	res.status(404).send({ message: "Endpoint not found" });
});

const port = Number(PORT)

if (process.env.VERCEL !== `1`) {
	app.listen(port, '0.0.0.0', () => {
		logger.info(`Server is running on port ${port}`);

		// Handle uncaught exceptions
		process.on('unhandledRejection', (reason, promise) => {
			logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
		});
	});
}

export default app;
