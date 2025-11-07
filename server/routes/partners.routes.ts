import { Router } from "express";
import { createPartner, deletePartner, getPartnerById, getPartners, updatePartner } from "../controllers/partners";
import { fileUpload, fileUploadAny } from "../middleware/multer";
import { authToken } from "../middleware/jwt";

const partnerRouter = Router()

partnerRouter.route("/partners")
  // Use the strict single-file middleware in production. During development, use
  // `fileUploadAny` to log and inspect incoming multipart fields if you hit
  // unexpected-field errors. This helps identify mismatches between client
  // field names and server expectations.
  // Protect creation of partners to authenticated admin users.
  .post(authToken, process.env.NODE_ENV === 'development' ? fileUploadAny : fileUpload, createPartner)
  .get(getPartners); 

// Protect update and delete operations for partners behind authToken middleware
partnerRouter
  .route("/partners/:id")
  .get(getPartnerById)
  .patch(authToken, process.env.NODE_ENV === 'development' ? fileUploadAny : fileUpload, updatePartner)
  .delete(authToken, deletePartner);
  
export default partnerRouter;

