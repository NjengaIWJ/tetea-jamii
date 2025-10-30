import fs from "fs";
import path from "path";
import multer, { type Multer, type FileFilterCallback } from "multer";
import { v2 as cloudinary } from "cloudinary";
import type { RequestHandler } from "express";

/* ---------- Cloudinary config (reads from env) ---------- */
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? "",
	api_key: process.env.CLOUDINARY_API_KEY ?? "",
	api_secret: process.env.CLOUDINARY_API_SECRET ?? "",
	timeout: Number(process.env.CLOUDINARY_TIMEOUT_MS ?? 60000),
});
export { cloudinary };

/* ---------- Configurable constants ---------- */
const DEFAULT_MAX_FILE_SIZE = Number(process.env.MAX_UPLOAD_BYTES ?? 10 * 1024 * 1024); // 10 MB
const ALLOWED_EXTENSIONS_RE = /\.(jpe?g|png|gif|docx?|pdf|txt|rtf|odt|xlsx|pptx|csv)$/i;
const ALLOWED_MIME_RE = /^(image\/jpeg|image\/png|image\/gif|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document|application\/pdf|text\/plain|application\/rtf|application\/vnd.oasis.opendocument.text|application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet|application\/vnd.openxmlformats-officedocument.presentationml.presentation|text\/csv)$/i;

/* ---------- Utilities ---------- */
function ensureDirSync(dir: string): void {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
}

function sanitizeFileName(originalName: string, maxLength = 100): string {
	const ext = path.extname(originalName).toLowerCase();
	let name = path.basename(originalName, ext);
	if (name.length > maxLength) name = name.slice(0, maxLength);
	name = name.replace(/[^a-zA-Z0-9_\-]/g, "_");
	return name + ext;
}

/* ---------- Optional disk storage (not used by default) ---------- */
const diskStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		try {
			const uploadDir = file.fieldname === "article" ? path.join("uploads", "articles") : path.join("uploads", "partners");
			ensureDirSync(uploadDir);
			cb(null, uploadDir);
		} catch (err) {
			cb(err as Error, "");
		}
	},
	filename: (req, file, cb) => {
		const clean = sanitizeFileName(file.originalname);
		const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		cb(null, `${unique}-${clean}`);
	},
});

/* ---------- Memory storage (default) ---------- */
const memoryStorage = multer.memoryStorage();

/* ---------- File filter (extension + mime) ---------- */
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
	const extOk = ALLOWED_EXTENSIONS_RE.test(path.extname(file.originalname));
	const mimeOk = ALLOWED_MIME_RE.test(file.mimetype);

	if (extOk && mimeOk) {
		cb(null, true);
	} else {
		cb(new Error("Unsupported file type. Allowed: images and common document formats (doc, docx, pdf, txt, rtf, odt, xlsx, pptx, csv)."));
	}
};

/* ---------- Multer instance (memory storage) ---------- */
const uploads: Multer = multer({
	storage: memoryStorage,
	limits: { fileSize: DEFAULT_MAX_FILE_SIZE },
	fileFilter,
});


// For forms without files
export const formParser: RequestHandler = uploads.none();

export const fileUpload: RequestHandler = uploads.single("file");

// Accept any file fields (debugging / flexible routes)
export const fileUploadAny: RequestHandler = uploads.any();

export default uploads;
