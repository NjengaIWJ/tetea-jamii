"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = require("../controllers/admin");
const jwt_1 = require("../middleware/jwt");
const adminRouter = (0, express_1.Router)();
adminRouter.post("/login", admin_1.login);
adminRouter.get("/verify", jwt_1.authToken);
adminRouter.use(jwt_1.authToken);
adminRouter.route("/").get(admin_1.getAdmins).post(admin_1.createAdmin);
adminRouter
    .route("/admins/:id")
    .get(admin_1.getAdminById)
    .put(admin_1.updateAdmin)
    .delete(admin_1.deleteAdmin);
adminRouter.get('/refresh', admin_1.refresh);
adminRouter.post("/logout", admin_1.logout);
exports.default = adminRouter;
//# sourceMappingURL=admin.routes.js.map