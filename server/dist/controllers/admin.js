"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = exports.deleteAdmin = exports.updateAdmin = exports.getAdminById = exports.getAdmins = exports.logout = exports.login = exports.createAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_model_1 = __importDefault(require("../models/Admin.model"));
const auth_config_1 = require("../config/auth.config");
const createAdmin = async (req, res) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {
        const existing = await Admin_model_1.default.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: "Email already in use" });
        }
        const admin = new Admin_model_1.default({
            username,
            email,
            password,
            role: role ?? "admin",
        });
        await admin.save();
        const safe = {
            id: admin._id,
            email: admin.email,
            username: admin.username,
            role: admin.role,
        };
        return res.status(201).json({ admin: safe, message: "Admin created" });
    }
    catch (err) {
        console.error("Error in createAdmin:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.createAdmin = createAdmin;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Missing fields" });
    }
    try {
        const admin = await Admin_model_1.default.findOne({ email }).select("+password");
        if (!admin) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const payload = {
            adminId: String(admin._id),
            email: admin.email,
            role: admin.role,
        };
        const token = jsonwebtoken_1.default.sign(payload, Buffer.from(auth_config_1.authConfig.jwtSecret), {
            expiresIn: auth_config_1.authConfig.jwtExpiry,
        });
        res.cookie("jwt", token, auth_config_1.authConfig.cookieOptions);
        const safe = {
            id: admin._id?.toString(),
            email: admin.email,
            username: admin.username,
            role: admin.role,
        };
        return res.status(200).json({ user: safe, token });
    }
    catch (err) {
        console.error("Error in login:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.login = login;
const logout = (req, res) => {
    res.clearCookie("jwt", auth_config_1.authConfig.cookieOptions);
    return res.json({ message: "Logged out" });
};
exports.logout = logout;
const getAdmins = async (req, res) => {
    try {
        const admins = await Admin_model_1.default.find().select("-password");
        return res.status(200).json({ admins });
    }
    catch (err) {
        console.error("Error in getAdmins:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAdmins = getAdmins;
const getAdminById = async (req, res) => {
    const { id } = req.params;
    try {
        const admin = await Admin_model_1.default.findById(id).select("-password");
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        return res.status(200).json({ admin });
    }
    catch (err) {
        console.error("Error in getAdminById:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAdminById = getAdminById;
const updateAdmin = async (req, res) => {
    const { id } = req.params;
    const { username, email, password, role } = req.body;
    try {
        const admin = await Admin_model_1.default.findById(id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        if (username)
            admin.username = username;
        if (email)
            admin.email = email;
        if (role)
            admin.role = role;
        if (password) {
            admin.password = password;
        }
        await admin.save();
        const safe = admin.toObject();
        delete safe.password;
        return res.status(200).json({ admin: safe });
    }
    catch (err) {
        console.error("Error in updateAdmin:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateAdmin = updateAdmin;
const deleteAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        const admin = await Admin_model_1.default.findByIdAndDelete(id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        return res.status(200).json({ message: "Admin deleted" });
    }
    catch (err) {
        console.error("Error in deleteAdmin:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteAdmin = deleteAdmin;
const refresh = async (req, res) => {
    try {
        // 1) Grab token from cookie or Authorization header as fallback
        const tokenFromCookie = req.cookies?.jwt;
        const authHeader = req.headers.authorization;
        const token = tokenFromCookie ?? (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined);
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        // 2) Verify token
        // Use the same secret used to sign tokens. You used Buffer.from(...) in sign; verify accepts Buffer or string.
        let payload;
        try {
            payload = jsonwebtoken_1.default.verify(token, Buffer.from(auth_config_1.authConfig.jwtSecret));
        }
        catch (err) {
            // token invalid or expired
            // If you want expired tokens to still allow refresh, you'd need a separate refresh token flow.
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        // 3) Basic payload sanity check
        if (!payload?.adminId) {
            return res.status(401).json({ message: "Invalid token payload" });
        }
        // 4) Ensure user still exists (and optionally check password rotation)
        const admin = await Admin_model_1.default.findById(payload.adminId).select("+password +passwordChangedAt");
        if (!admin) {
            // user deleted or revoked
            return res.status(401).json({ message: "Account no longer exists" });
        }
        // Optional security: If your Admin schema stores a `passwordChangedAt` timestamp,
        // you should check whether the token was issued before the password change.
        // iat is in seconds since epoch
        if (admin.passwordChangedAt) {
            const pwdChangedAt = Math.floor(new Date(admin.passwordChangedAt).getTime() / 1000);
            const tokenIat = typeof payload.iat === "number" ? payload.iat : 0;
            if (pwdChangedAt > tokenIat) {
                // password changed after token issued -> revoke
                return res.status(401).json({ message: "Token invalid due to password change" });
            }
        }
        // 5) Build new payload and sign a new token
        const newPayload = {
            adminId: String(admin._id),
            email: admin.email,
            role: admin.role,
        };
        const newToken = jsonwebtoken_1.default.sign(newPayload, Buffer.from(auth_config_1.authConfig.jwtSecret), { expiresIn: auth_config_1.authConfig.jwtExpiry } // e.g. '15m' or '1h'
        );
        // 6) Set cookie (same options you use in login)
        // Make sure authConfig.cookieOptions includes httpOnly: true, secure: true in prod, sameSite
        res.cookie("jwt", newToken, auth_config_1.authConfig.cookieOptions);
        // 7) Return safe user object + token if you want to use it client-side
        const safe = {
            id: admin._id?.toString(),
            email: admin.email,
            username: admin.username,
            role: admin.role,
        };
        return res.status(200).json({ user: safe, token: newToken });
    }
    catch (err) {
        console.error("Error in refresh:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.refresh = refresh;
//# sourceMappingURL=admin.js.map