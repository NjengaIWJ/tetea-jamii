"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = require("../middleware/multer");
const docs_1 = require("../controllers/docs");
const documentRouter = (0, express_1.Router)();
documentRouter
    .route("/documents")
    .get(docs_1.listDocuments)
    .post(multer_1.fileUpload, docs_1.createDocument);
documentRouter
    .route("/documents/:id")
    .get(docs_1.getDocumentById)
    .delete(docs_1.deleteDocumentById);
exports.default = documentRouter;
//# sourceMappingURL=document.routes.js.map