"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcryptjs_1 = require("bcryptjs");
const AdminSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
}, { timestamps: true });
AdminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await (0, bcryptjs_1.genSalt)(10);
    this.password = await (0, bcryptjs_1.hash)(this.password, salt);
    next();
});
AdminSchema.methods.comparePassword = async function (candidate) {
    return await (0, bcryptjs_1.compare)(candidate, this.password);
};
AdminSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate();
    if (update && "password" in update) {
        const newPass = update.password;
        const salt = await (0, bcryptjs_1.genSalt)(10);
        const hashed = await (0, bcryptjs_1.hash)(newPass, salt);
        this.setUpdate({ ...update, password: hashed });
    }
    next();
});
const Admin = (0, mongoose_1.model)("Admin", AdminSchema);
exports.default = Admin;
//# sourceMappingURL=Admin.model.js.map