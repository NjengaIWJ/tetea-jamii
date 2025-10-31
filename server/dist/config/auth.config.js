"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.authConfig = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
}
const jwtSecret = process.env.JWT_SECRET;
const frontendURL = process.env.FRONTEND_URL;
exports.authConfig = {
    jwtSecret,
    jwtExpiry: process.env.EXPIRY_TIME || '1h',
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
    // You might want to add refresh token settings here
    refreshToken: {
        expiry: '7d',
        cookieName: 'refreshToken',
    },
    frontendURL
};
// Type guard to ensure JWT secret is available
if (!exports.authConfig.jwtSecret) {
    throw new Error('JWT_SECRET must be a non-empty string');
}
if (!exports.authConfig.frontendURL) {
    throw new Error('FRONTEND_URL must be a non-empty string');
}
//# sourceMappingURL=auth.config.js.map