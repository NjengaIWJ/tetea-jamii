"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const articles_1 = require("../controllers/articles");
const multer_1 = __importDefault(require("../middleware/multer"));
const articlesRouter = (0, express_1.Router)();
articlesRouter
    .route("/articles")
    .get(articles_1.getArticles)
    .post(multer_1.default.array("article"), articles_1.createArticle);
articlesRouter
    .route("/articles/:id")
    .get(articles_1.getArticleById)
    .put(articles_1.updateArticle)
    .delete(articles_1.deleteArticle);
exports.default = articlesRouter;
//# sourceMappingURL=articles.routes.js.map