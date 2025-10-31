import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy, } from "passport-jwt";
import Admin from "../models/Admin.model";
import { config } from "../config/config";
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwt.secret,
    passReqToCallback: true,
};
passport.use(new JwtStrategy(opts, async (req, payload, done) => {
    try {
        const user = await Admin.findById(payload.id);
        if (user)
            return done(null, user);
        return done(null, false);
    }
    catch (err) {
        return done(err, false);
    }
}));
export default passport;
//# sourceMappingURL=passport.js.map