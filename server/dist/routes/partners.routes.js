"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const partners_1 = require("../controllers/partners");
const multer_1 = require("../middleware/multer");
const partnerRouter = (0, express_1.Router)();
partnerRouter.route("/partners")
    // Use the strict single-file middleware in production. During development, use
    // `fileUploadAny` to log and inspect incoming multipart fields if you hit
    // unexpected-field errors. This helps identify mismatches between client
    // field names and server expectations.
    .post(process.env.NODE_ENV === 'development' ? multer_1.fileUploadAny : multer_1.fileUpload, partners_1.createPartner)
    .get(partners_1.getPartners);
partnerRouter.route("/partners/:id").get(partners_1.getPartnerById).patch(partners_1.updatePartner).delete(partners_1.deletePartner);
exports.default = partnerRouter;
//# sourceMappingURL=partners.routes.js.map