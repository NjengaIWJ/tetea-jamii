"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocumentById = exports.listDocuments = exports.getDocumentById = exports.createDocument = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cloudinary_1 = require("cloudinary");
const cloudinary_2 = require("../config/cloudinary");
const Document_model_1 = require("../models/Document.model");
const isValidObjectId = (id) => mongoose_1.default.Types.ObjectId.isValid(id);
/**
 * POST /documents
 * Expects multipart form with: title, file (single file via multer memoryStorage)
 */
const createDocument = async (req, res) => {
    try {
        const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
        const file = req.file;
        if (!file) {
            return res.status(400).json({ success: false, message: "Validation error", error: "No file uploaded" });
        }
        if (!title) {
            return res.status(400).json({ success: false, message: "Validation error", error: "Title is required" });
        }
        // Upload to Cloudinary
        const cloudUrl = await (0, cloudinary_2.streamUpload)(file);
        // streamUpload currently resolves secure_url; we need public_id for deletes.
        // If your streamUpload returns only URL, update it to return both URL and public_id.
        // For now, attempt to retrieve public_id from Cloudinary by searching the URL (not ideal).
        // Better: update streamUpload to resolve { secure_url, public_id, bytes }.
        // Below assumes streamUpload was updated to return { secure_url, public_id, bytes }.
        // If your streamUpload returns just a string, replace the next two lines with proper handling.
        // Example expects streamUpload to return { secure_url, public_id, bytes }:
        // const { secure_url, public_id, bytes } = await streamUpload(file);
        // For the code below, assume streamUpload returns an object:
        const uploadResult = await (0, cloudinary_2.streamUpload)(file);
        const doc = await Document_model_1.DocumentModel.create({
            title,
            fileName: file.originalname,
            mimetype: file.mimetype,
            size: file.size || uploadResult.bytes || 0,
            cloudinaryUrl: uploadResult.secure_url,
            cloudinaryPublicId: uploadResult.public_id,
        });
        return res.status(201).json({
            success: true,
            message: "Document saved",
            data: { id: doc._id, url: doc.cloudinaryUrl },
        });
    }
    catch (err) {
        console.error("createDocument error:", err);
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};
exports.createDocument = createDocument;
/**
 * GET /documents/:id
 * Returns Cloudinary URL (redirect) so client downloads directly from Cloudinary
 */
const getDocumentById = async (req, res) => {
    try {
        const docId = req.params.id;
        if (!docId || !isValidObjectId(docId)) {
            return res.status(400).json({ success: false, message: "Invalid document id", error: "Bad request" });
        }
        const doc = await Document_model_1.DocumentModel.findById(docId).lean().exec();
        if (!doc) {
            return res.status(404).json({ success: false, message: "Document not found" });
        }
        return res.status(200).json({
            success: true,
            data: {
                url: doc.cloudinaryUrl,
                title: doc.title,
                fileName: doc.fileName,
                mimetype: doc.mimetype,
                size: doc.size
            }
        });
    }
    catch (err) {
        console.error("getDocumentById error:", err);
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};
exports.getDocumentById = getDocumentById;
/**
 * GET /documents
 * List documents with pagination
 */
const listDocuments = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(String(req.query.page || "1"), 10));
        const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || "10"), 10)));
        const q = typeof req.query.q === "string" && req.query.q.trim() ? req.query.q.trim() : null;
        const filter = {};
        if (q)
            filter.title = { $regex: q, $options: "i" };
        const [items, total] = await Promise.all([
            Document_model_1.DocumentModel.find(filter, "title uploadDate fileName size mimetype cloudinaryUrl")
                .sort({ uploadDate: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean()
                .exec(),
            Document_model_1.DocumentModel.countDocuments(filter).exec(),
        ]);
        return res.status(200).json({
            success: true,
            data: { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } },
        });
    }
    catch (err) {
        console.error("listDocuments error:", err);
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};
exports.listDocuments = listDocuments;
/**
 * DELETE /documents/:id
 * Remove Cloudinary asset then DB record
 */
const deleteDocumentById = async (req, res) => {
    try {
        const docId = req.params.id;
        if (!docId || !isValidObjectId(docId)) {
            return res.status(400).json({ success: false, message: "Invalid document id", error: "Bad request" });
        }
        const doc = await Document_model_1.DocumentModel.findById(docId).exec();
        if (!doc) {
            return res.status(404).json({ success: false, message: "Document not found" });
        }
        // Remove from Cloudinary
        try {
            await cloudinary_1.v2.uploader.destroy(doc.cloudinaryPublicId, { resource_type: "auto" });
        }
        catch (cloudErr) {
            console.error("Failed to delete Cloudinary asset:", cloudErr);
            // choose whether to abort or continue; here we continue to delete DB record
        }
        await doc.deleteOne();
        return res.status(200).json({ success: true, message: "Document deleted" });
    }
    catch (err) {
        console.error("deleteDocumentById error:", err);
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};
exports.deleteDocumentById = deleteDocumentById;
//# sourceMappingURL=docs.js.map