import { Router } from "express";
import {
	createAdmin,
	deleteAdmin,
	getAdminById,
	getAdmins,
	login,
	logout,
	refresh,
	updateAdmin,
} from "../controllers/admin";
import { authToken } from "../middleware/jwt";

const adminRouter = Router();

adminRouter.post("/login", login);

adminRouter.get('/refresh', refresh);
adminRouter.get("/verify", authToken);

adminRouter.use(authToken);

adminRouter.route("/").get(getAdmins).post(createAdmin);

adminRouter
	.route("/admins/:id")
	.get(getAdminById)
	.put(updateAdmin)
	.delete(deleteAdmin);


adminRouter.post("/logout", logout);

export default adminRouter;
