"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PartnerSchema = new mongoose_1.Schema({
    media: {
        // Keep this as 'media' to match your frontend expectations
        type: String,
        required: [true, "Partner image is required"],
        trim: true,
        validate: {
            validator: function (v) {
                // Allow both local file paths and URLs
                return (/^\/uploads\/partners\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v) ||
                    /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(v));
            },
            message: "Please provide a valid image path or URL",
        },
    },
    name: {
        type: String,
        required: [true, "Partner name is required"],
        trim: true,
        minlength: [2, "Partner name must be at least 2 characters long"],
        maxlength: [100, "Partner name cannot exceed 100 characters"],
    },
    publicId: {
        type: String,
        required: [true, "Cloudinary public ID is required"],
        trim: true,
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    // Add some additional options for better performance and consistency
    toJSON: { virtuals: true }, // Include virtual fields when converting to JSON
    toObject: { virtuals: true },
});
// Add an index on the name field for faster queries
PartnerSchema.index({ name: 1 });
// Add a pre-save middleware to ensure name consistency
PartnerSchema.pre('save', function (next) {
    if (this.name) {
        this.name = this.name.trim();
    }
    next();
});
// Create and export the model
const Partners = (0, mongoose_1.model)('Partners', PartnerSchema);
exports.default = Partners;
//# sourceMappingURL=Partner.model.js.map