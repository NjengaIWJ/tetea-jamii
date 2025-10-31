import { Schema, model, Document } from "mongoose";
import { genSalt, hash, compare } from "bcryptjs";
const AdminSchema = new Schema({
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
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
    next();
});
AdminSchema.methods.comparePassword = async function (candidate) {
    return await compare(candidate, this.password);
};
AdminSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate();
    if (update && "password" in update) {
        const newPass = update.password;
        const salt = await genSalt(10);
        const hashed = await hash(newPass, salt);
        this.setUpdate({ ...update, password: hashed });
    }
    next();
});
const Admin = model("Admin", AdminSchema);
export default Admin;
//# sourceMappingURL=Admin.model.js.map