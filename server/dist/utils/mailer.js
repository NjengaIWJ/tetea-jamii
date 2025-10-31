"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const env_config_1 = require("../config/env.config");
const { SENDGRID_API_KEY, SENDGRID_FROM, EMAIL_USER, EMAIL_PASS } = env_config_1.envConfig;
if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error("Missing EMAIL_USER or EMAIL_PASS in environment variables");
}
if (!SENDGRID_API_KEY) {
    throw new Error("Missing SENDGRID_API_KEY in environment variables");
}
mail_1.default.setApiKey(SENDGRID_API_KEY);
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
    pool: true,
    maxConnections: 5,
});
const sender = async (req, res) => {
    try {
        // Validate request body
        if (!req.body) {
            return res.status(400).json({
                status: false,
                message: "Request body is missing"
            });
        }
        const { email, message } = req.body;
        // Validate required fields
        if (!email || !message) {
            return res.status(400).json({
                status: false,
                message: "Email and message are required"
            });
        }
        const to = EMAIL_USER;
        if (!to) {
            throw new Error("EMAIL_USER environment variable is not set");
        }
        const mail = {
            from: `"Tujitegemee Contact" <${EMAIL_USER}>`,
            to,
            replyTo: email,
            subject: `New Contact Message from ${email}`,
            text: message,
            html: `<p>${message}</p><p><br>From: ${email}</p>`,
        };
        // Verify transporter connection
        await transporter.verify();
        // Send email
        const info = await transporter.sendMail(mail);
        console.log("Email sent successfully:", info.messageId);
        return res.status(200).json({
            status: true,
            message: "Email sent successfully",
            messageId: info.messageId
        });
    }
    catch (err) {
        console.error("Email sending error:", err);
        return res.status(500).json({
            status: false,
            message: err instanceof Error ? err.message : "Failed to send email"
        });
    }
};
mail_1.default.setApiKey(SENDGRID_API_KEY);
const sendEmail = async (req, res) => {
    // Validate request body
    if (!req.body) {
        return res.status(400).json({
            status: false,
            message: "Request body is missing"
        });
    }
    if (!SENDGRID_FROM) {
        throw new Error("SENDGRID_FROM environment variable is not set");
    }
    const { email, message } = req.body;
    const msg = {
        from: `"Tujitegemee Contact" <${EMAIL_USER}>`,
        to: SENDGRID_FROM,
        replyTo: email,
        subject: `New Contact Message from ${email}`,
        text: message,
        html: `<p>${message}</p><p><br>From: ${email}</p>`,
    };
    try {
        const response = await mail_1.default.send(msg);
        console.log("Email sent:", response[0].statusCode);
    }
    catch (error) {
        console.error("Error sending email:", error.response?.body || error);
        throw error;
    }
};
exports.sendEmail = sendEmail;
exports.default = sender;
//# sourceMappingURL=mailer.js.map