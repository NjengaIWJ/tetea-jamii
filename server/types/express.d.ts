import type { AdminJwtPayload } from "../middleware/jwt";

declare global {
	namespace Express {
		interface Request {
			admin?: AdminJwtPayload;
		}
	}
}
