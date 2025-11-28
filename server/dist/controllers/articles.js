"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticle = exports.updateArticle = exports.getArticleById = exports.getArticles = exports.createArticle = void 0;
const mongoose_1 = require("mongoose");
const cloudinary_1 = require("../config/cloudinary");
const Story_model_1 = __importDefault(require("../models/Story.model"));
const createArticle = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({ success: false, message: "Validation error", error: "Title is required" });
        }
        if (typeof content !== "string" || !content.trim()) {
            return res.status(400).json({ success: false, message: "Validation error", error: "Content is required" });
        }
        const files = Array.isArray(req.files) ? req.files : [];
        const mediaItems = [];
        if (files.length > 0) {
            const uploadPromises = files.map(file => (0, cloudinary_1.streamUpload)(file));
            const results = await Promise.all(uploadPromises);
            for (const r of results) {
                mediaItems.push({ url: r.secure_url, publicId: r.public_id });
            }
        }
        const article = await Story_model_1.default.create({
            title: title.trim(),
            content: content.trim(),
            media: mediaItems.map(m => m.url),
            mediaPublicIds: mediaItems.map(m => m.publicId)
        });
        return res.status(201).json({
            success: true,
            message: "Article created successfully",
            data: {
                id: article._id.toString(),
                media: mediaItems
            }
        });
    }
    catch (err) {
        console.error("Article creation error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to create article",
            error: err instanceof Error ? err.message : "Unknown error occurred",
        });
    }
};
exports.createArticle = createArticle;
const getArticles = async (req, res) => {
    try {
        const articles = await Story_model_1.default.find();
        res.status(200).json(articles);
    }
    catch (error) {
        console.error("Error fetching articles:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getArticles = getArticles;
const getArticleById = async (req, res) => {
    const { id } = req.params;
    if (!id || !mongoose_1.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid article ID format" });
    }
    try {
        const article = await Story_model_1.default.findById(id);
        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }
        res.status(200).json(article);
    }
    catch (error) {
        console.error("Error fetching article:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getArticleById = getArticleById;
const updateArticle = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    if (!id || !mongoose_1.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            error: "Invalid article ID"
        });
    }
    try {
        const files = Array.isArray(req.files) ? req.files : [];
        const article = await Story_model_1.default.findById(id);
        if (!article) {
            return res.status(404).json({
                success: false,
                error: "Article not found"
            });
        }
        const updates = {};
        if (title)
            updates.title = title.trim();
        if (content)
            updates.content = content.trim();
        if (files.length > 0) {
            const mediaItems = [];
            const uploadPromises = files.map(file => (0, cloudinary_1.streamUpload)(file));
            const results = await Promise.all(uploadPromises);
            for (const r of results) {
                mediaItems.push({ url: r.secure_url, publicId: r.public_id });
            }
            updates.media = mediaItems.map(m => m.url);
        }
        const updatedArticle = await Story_model_1.default.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedArticle) {
            return res.status(500).json({
                success: false,
                error: "Failed to update article"
            });
        }
        res.status(200).json({
            success: true,
            message: "Article updated successfully",
            data: updatedArticle
        });
    }
    catch (error) {
        console.error("Error updating article:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Internal server error"
        });
    }
};
exports.updateArticle = updateArticle;
const deleteArticle = async (req, res) => {
    const { id } = req.params;
    if (!id || !mongoose_1.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            error: "Invalid article ID"
        });
    }
    try {
        const article = await Story_model_1.default.findById(id);
        if (!article) {
            return res.status(404).json({
                success: false,
                error: "Article not found"
            });
        }
        await Story_model_1.default.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Article deleted successfully"
        });
    }
    catch (error) {
        console.error("Error deleting article:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Internal server error"
        });
    }
};
exports.deleteArticle = deleteArticle;
//# sourceMappingURL=articles.js.map