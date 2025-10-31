import { Router } from "express";
import {
	createArticle,
	getArticles,
	getArticleById,
	updateArticle,
	deleteArticle,
} from "../controllers/articles";
import uploads from "../middleware/multer";

const articlesRouter = Router();

articlesRouter
	.route("/articles")
	.get(getArticles)
	.post(uploads.array("article"), createArticle);

articlesRouter
	.route("/articles/:id")
	.get(getArticleById)
	.put(updateArticle)
	.delete(deleteArticle);

export default articlesRouter;

