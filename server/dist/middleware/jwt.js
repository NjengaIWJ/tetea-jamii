"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getJWTSecret = () => {
    const s = process.env.JWT_SECRET;
    if (!s)
        throw new Error("JWT_SECRET not defined");
    return s;
};
const authToken = (req, res, next) => {
    // 1. Try header
    const authHeader = req.headers["authorization"];
    let token;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
    }
    // 2. If not found in header, try cookie
    if (!token && req.cookies) {
        token = req.cookies["jwt"];
    }
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, getJWTSecret());
        // augmenting Request with a custom property — cast to any so TypeScript accepts the assignment
        req.admin = payload;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.authToken = authToken;
//# sourceMappingURL=jwt.js.map