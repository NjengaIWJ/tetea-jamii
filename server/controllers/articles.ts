import type { Request, Response } from "express";
import { Types } from "mongoose";

import { streamUpload } from "../config/cloudinary";
import Story from "../models/Story.model";


type ApiResponse<T = unknown> = {
	success: boolean;
	message?: string;
	data?: T;
	error?: string;
};

const createArticle = async (
	req: Request,
	res: Response<ApiResponse<{ id: string; media: { url: string; publicId: string }[] }>>
) => {
	try {
		const { title, content } = req.body;

		if (typeof title !== "string" || !title.trim()) {
			return res.status(400).json({ success: false, message: "Validation error", error: "Title is required" });
		}
		if (typeof content !== "string" || !content.trim()) {
			return res.status(400).json({ success: false, message: "Validation error", error: "Content is required" });
		}

		const files = Array.isArray(req.files) ? req.files as Express.Multer.File[] : [];

		const mediaItems: { url: string; publicId: string }[] = [];

		if (files.length > 0) {
			const uploadPromises = files.map(file =>
				streamUpload(file)
			);
			const results = await Promise.all(uploadPromises);

			for (const r of results) {
				mediaItems.push({ url: r.secure_url, publicId: r.public_id });
			}
		}

		const article = await Story.create({
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

	} catch (err) {
		console.error("Article creation error:", err);
		return res.status(500).json({
			success: false,
			message: "Failed to create article",
			error: err instanceof Error ? err.message : "Unknown error occurred",
		});
	}
};


const getArticles = async (req: Request, res: Response) => {
	try {
		const articles = await Story.find();
		res.status(200).json(articles);
	} catch (error) {
		console.error("Error fetching articles:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const getArticleById = async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id || !Types.ObjectId.isValid(id)) {
		return res.status(400).json({ error: "Invalid article ID format" });
	}

	try {
		const article = await Story.findById(id);

		if (!article) {
			return res.status(404).json({ error: "Article not found" });
		}

		res.status(200).json(article);
	} catch (error) {
		console.error("Error fetching article:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const updateArticle = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { title, content, media } = req.body;

	try {
		const updates: { title?: string, content?: string, media?: string } = {}

		if (title) updates.title = title
		if (content) updates.content = content
		if (media) updates.media = media

		const article = await Story.findByIdAndUpdate(
			Number(id),
			updates,
			{ new: true }
		);

		res
			.status(200)
			.json({ article, message: `Article ${title} updated successfully` });
	} catch (error) {
		console.error("Error updating article:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const deleteArticle = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const article = await Story.findByIdAndDelete(Number(id));

		res.status(200).json({
			article,
			message: `Article ${article?.title} deleted successfully`,
		});
	} catch (error) {
		console.error("Error deleting article:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export {
	createArticle,
	getArticles,
	getArticleById,
	updateArticle,
	deleteArticle,
};
