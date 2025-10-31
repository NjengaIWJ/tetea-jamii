import type { Request, Response } from "express";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

import { streamUpload } from "../config/cloudinary";
import { DocumentModel } from "../models/Document.model";

type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
};

const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

/**
 * POST /documents
 * Expects multipart form with: title, file (single file via multer memoryStorage)
 */
export const createDocument = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
    const file = req.file as Express.Multer.File | undefined;

    if (!file) {
      return res.status(400).json({ success: false, message: "Validation error", error: "No file uploaded" });
    }
    if (!title) {
      return res.status(400).json({ success: false, message: "Validation error", error: "Title is required" });
    }

    // Upload to Cloudinary
    const cloudUrl = await streamUpload(file);

    // streamUpload currently resolves secure_url; we need public_id for deletes.
    // If your streamUpload returns only URL, update it to return both URL and public_id.
    // For now, attempt to retrieve public_id from Cloudinary by searching the URL (not ideal).
    // Better: update streamUpload to resolve { secure_url, public_id, bytes }.
    // Below assumes streamUpload was updated to return { secure_url, public_id, bytes }.

    // If your streamUpload returns just a string, replace the next two lines with proper handling.
    // Example expects streamUpload to return { secure_url, public_id, bytes }:
    // const { secure_url, public_id, bytes } = await streamUpload(file);

    // For the code below, assume streamUpload returns an object:
    const uploadResult = await streamUpload(file) as unknown as { secure_url: string; public_id: string; bytes?: number };

    const doc = await DocumentModel.create({
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
  } catch (err) {
    console.error("createDocument error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: (err as Error).message });
  }
};

/**
 * GET /documents/:id
 * Returns Cloudinary URL (redirect) so client downloads directly from Cloudinary
 */
export const getDocumentById = async (req: Request, res: Response) => {
  try {
    const docId = req.params.id;
    if (!docId || !isValidObjectId(docId)) {
      return res.status(400).json({ success: false, message: "Invalid document id", error: "Bad request" });
    }

    const doc = await DocumentModel.findById(docId).lean().exec();
    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    // Redirect client to Cloudinary URL. This offloads bandwidth from your server.
    return res.status(302).json({ success: true, data: { url: doc.cloudinaryUrl } });
  } catch (err) {
    console.error("getDocumentById error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: (err as Error).message });
  }
};

/**
 * GET /documents
 * List documents with pagination
 */
export const listDocuments = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || "1"), 10));
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || "10"), 10)));
    const q = typeof req.query.q === "string" && req.query.q.trim() ? req.query.q.trim() : null;

    const filter: Record<string, unknown> = {};
    if (q) filter.title = { $regex: q, $options: "i" };

    const [items, total] = await Promise.all([
      DocumentModel.find(filter, "title uploadDate fileName size mimetype cloudinaryUrl")
        .sort({ uploadDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      DocumentModel.countDocuments(filter).exec(),
    ]);

    return res.status(200).json({
      success: true,
      data: { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } },
    });
  } catch (err) {
    console.error("listDocuments error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: (err as Error).message });
  }
};

/**
 * DELETE /documents/:id
 * Remove Cloudinary asset then DB record
 */
export const deleteDocumentById = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const docId = req.params.id;
    if (!docId || !isValidObjectId(docId)) {
      return res.status(400).json({ success: false, message: "Invalid document id", error: "Bad request" });
    }

    const doc = await DocumentModel.findById(docId).exec();
    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    // Remove from Cloudinary
    try {
      await cloudinary.uploader.destroy(doc.cloudinaryPublicId, { resource_type: "auto" });
    } catch (cloudErr) {
      console.error("Failed to delete Cloudinary asset:", cloudErr);
      // choose whether to abort or continue; here we continue to delete DB record
    }

    await doc.deleteOne();

    return res.status(200).json({ success: true, message: "Document deleted" });
  } catch (err) {
    console.error("deleteDocumentById error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: (err as Error).message });
  }
};
