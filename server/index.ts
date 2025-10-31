import * as dotenv from 'dotenv';
dotenv.config()

import express, { type Request, type Response } from "express";
import { createServer } from "http";
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

const {PORT, frontendURL,mongoUri } = envConfig

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

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(helmet());

app.get("/", (req: Request, res: Response) => {
	res.send("API is running...");
});

	(async () => {
		if (mongoUri) {try{
			await connectDB(mongoUri)

			console.log("Connected to the database successfully.");
		} catch (err) {
			console.error("Failed to connect to the database:", err);
			process.exit(1);
		}
	}else {
			console.warn("Skipping DB connect because mongoUri is empty.");
		}
	})()

	app.use("/api/sendEmail", formParser, sender);
app.use("/api", adminRouter);
app.use("/api", articlesRouter);
app.use("/api", partnerRouter);
app.use("/api", documentRouter);

app.use((err: Error, req: Request, res: Response, next: Function) => {
	console.error(err.stack);
	res.status(500).send({ message: err.message });
});

app.use((req: Request, res: Response) => {
	res.status(404).send({ message: "Endpoint not found" });
});

const port = Number(PORT) || 3000;

/* app.listen(port, '0.0.0.0', () => {
	console.log(`Server is running on port ${port}`);
	process.on('unhandledRejection', (reason, promise) => {
		console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	});
}); */

export default app;