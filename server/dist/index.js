"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const env_config_1 = require("./config/env.config");
const passport_1 = __importDefault(require("./middleware/passport"));
const db_1 = __importDefault(require("./utils/db"));
const multer_1 = require("./middleware/multer");
const mailer_1 = __importDefault(require("./utils/mailer"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const articles_routes_1 = __importDefault(require("./routes/articles.routes"));
const partners_routes_1 = __importDefault(require("./routes/partners.routes"));
const document_routes_1 = __importDefault(require("./routes/document.routes"));
const { PORT, frontendURL, mongoUri } = env_config_1.envConfig;
console.log(PORT, frontendURL, mongoUri, 'env');
const app = (0, express_1.default)();
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
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(passport_1.default.initialize());
app.use((0, helmet_1.default)());
app.get("/", (req, res) => {
    res.send("API is running...");
});
(async () => {
    if (mongoUri) {
        try {
            await (0, db_1.default)(mongoUri);
            console.log("Connected to the database successfully.");
        }
        catch (err) {
            console.error("Failed to connect to the database:", err);
            process.exit(1);
        }
    }
    else {
        console.warn("Skipping DB connect because mongoUri is empty.");
    }
})();
app.use("/api/sendEmail", multer_1.formParser, mailer_1.default);
app.use("/api", admin_routes_1.default);
app.use("/api", articles_routes_1.default);
app.use("/api", partners_routes_1.default);
app.use("/api", document_routes_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: err.message });
});
app.use((req, res) => {
    res.status(404).send({ message: "Endpoint not found" });
});
const port = Number(PORT);
if (process.env.VERCEL !== `1`) {
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server is running on port ${port}`);
        process.on('unhandledRejection', (reason, promise) => {
            console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        });
    });
}
exports.default = app;
//# sourceMappingURL=index.js.map