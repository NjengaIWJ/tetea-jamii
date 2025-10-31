"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const Admin_model_1 = __importDefault(require("../models/Admin.model"));
const config_1 = require("../config/config");
const opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config_1.config.jwt.secret,
    passReqToCallback: true,
};
passport_1.default.use(new passport_jwt_1.Strategy(opts, async (req, payload, done) => {
    try {
        const user = await Admin_model_1.default.findById(payload.id);
        if (user)
            return done(null, user);
        return done(null, false);
    }
    catch (err) {
        return done(err, false);
    }
}));
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map