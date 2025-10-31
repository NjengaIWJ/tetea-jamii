import * as dotenv from "dotenv";
dotenv.config();
export const envConfig = {
    PORT: process.env.PORT || 8080,
    frontendURL: process.env.FRONTEND_URL,
    mongoUri: process.env.MONGO_URI,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_FROM: process.env.SENDGRID_FROM,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    JWT_SECRET: process.env.JWT_SECRET,
    EXPIRY_TIME: process.env.EXPIRY_TIME,
    FRONTEND_URL_NETWORK: process.env.FRONTEND_URL_NETWORK,
    SMTP_HOST: process.env.SMTP_HOST
};
//# sourceMappingURL=env.config.js.map