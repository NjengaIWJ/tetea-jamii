import { Router } from "express";
import uploads, { fileUpload } from "../middleware/multer.ts";
import { createDocument, deleteDocumentById, getDocumentById, listDocuments } from "../controllers/docs.ts";

const documentRouter = Router();

documentRouter
  .route("/documents")
  .get(listDocuments)
  .post(fileUpload, createDocument);

documentRouter
  .route("/documents/:id")
  .get(getDocumentById)
  .delete(deleteDocumentById);

export default documentRouter;
