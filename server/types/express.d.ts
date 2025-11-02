declare global {
	namespace Express {
		interface Request {
			// Use an inline import type to avoid circular imports in declaration files
			admin?: import("../middleware/jwt").AdminJwtPayload;
		}
	}
}
