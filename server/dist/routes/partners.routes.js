import { Router } from "express";
import { createPartner, deletePartner, getPartnerById, getPartners, updatePartner } from "../controllers/partners";
import { fileUpload, fileUploadAny } from "../middleware/multer";
const partnerRouter = Router();
partnerRouter.route("/partners")
    // Use the strict single-file middleware in production. During development, use
    // `fileUploadAny` to log and inspect incoming multipart fields if you hit
    // unexpected-field errors. This helps identify mismatches between client
    // field names and server expectations.
    .post(process.env.NODE_ENV === 'development' ? fileUploadAny : fileUpload, createPartner)
    .get(getPartners);
partnerRouter.route("/partners/:id").get(getPartnerById).patch(updatePartner).delete(deletePartner);
export default partnerRouter;
//# sourceMappingURL=partners.routes.js.map