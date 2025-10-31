"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploadAny = exports.fileUpload = exports.formParser = exports.cloudinary = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
/* ---------- Cloudinary config (reads from env) ---------- */
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? "",
    api_key: process.env.CLOUDINARY_API_KEY ?? "",
    api_secret: process.env.CLOUDINARY_API_SECRET ?? "",
    timeout: Number(process.env.CLOUDINARY_TIMEOUT_MS ?? 60000),
});
/* ---------- Configurable constants ---------- */
const DEFAULT_MAX_FILE_SIZE = Number(process.env.MAX_UPLOAD_BYTES ?? 10 * 1024 * 1024); // 10 MB
const ALLOWED_EXTENSIONS_RE = /\.(jpe?g|png|gif|docx?|pdf|txt|rtf|odt|xlsx|pptx|csv)$/i;
const ALLOWED_MIME_RE = /^(image\/jpeg|image\/png|image\/gif|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document|application\/pdf|text\/plain|application\/rtf|application\/vnd.oasis.opendocument.text|application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet|application\/vnd.openxmlformats-officedocument.presentationml.presentation|text\/csv)$/i;
/* ---------- Utilities ---------- */
function ensureDirSync(dir) {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
}
function sanitizeFileName(originalName, maxLength = 100) {
    const ext = path_1.default.extname(originalName).toLowerCase();
    let name = path_1.default.basename(originalName, ext);
    if (name.length > maxLength)
        name = name.slice(0, maxLength);
    name = name.replace(/[^a-zA-Z0-9_\-]/g, "_");
    return name + ext;
}
/* ---------- Optional disk storage (not used by default) ---------- */
const diskStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        try {
            const uploadDir = file.fieldname === "article" ? path_1.default.join("uploads", "articles") : path_1.default.join("uploads", "partners");
            ensureDirSync(uploadDir);
            cb(null, uploadDir);
        }
        catch (err) {
            cb(err, "");
        }
    },
    filename: (req, file, cb) => {
        const clean = sanitizeFileName(file.originalname);
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}-${clean}`);
    },
});
/* ---------- Memory storage (default) ---------- */
const memoryStorage = multer_1.default.memoryStorage();
/* ---------- File filter (extension + mime) ---------- */
const fileFilter = (req, file, cb) => {
    const extOk = ALLOWED_EXTENSIONS_RE.test(path_1.default.extname(file.originalname));
    const mimeOk = ALLOWED_MIME_RE.test(file.mimetype);
    if (extOk && mimeOk) {
        cb(null, true);
    }
    else {
        cb(new Error("Unsupported file type. Allowed: images and common document formats (doc, docx, pdf, txt, rtf, odt, xlsx, pptx, csv)."));
    }
};
/* ---------- Multer instance (memory storage) ---------- */
const uploads = (0, multer_1.default)({
    storage: memoryStorage,
    limits: { fileSize: DEFAULT_MAX_FILE_SIZE },
    fileFilter,
});
// For forms without files
exports.formParser = uploads.none();
exports.fileUpload = uploads.single("file");
// Accept any file fields (debugging / flexible routes)
exports.fileUploadAny = uploads.any();
exports.default = uploads;
//# sourceMappingURL=multer.js.map