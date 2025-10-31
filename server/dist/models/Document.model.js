import { Schema, model } from "mongoose";
const DocumentSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters long']
    },
    fileName: {
        type: String,
        required: [true, 'Filename is required'],
        trim: true
    },
    mimetype: {
        type: String,
        required: [true, 'Mime type is required'],
        enum: {
            values: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            message: 'Invalid file type. Only PDF and Word documents are allowed.'
        }
    },
    size: {
        type: Number,
        required: [true, 'File size is required'],
        max: [5 * 1024 * 1024, 'File size cannot exceed 5MB']
    },
    cloudinaryUrl: {
        type: String,
        required: [true, 'Cloudinary URL is required']
    },
    cloudinaryPublicId: {
        type: String,
        required: [true, 'Cloudinary public ID is required']
    },
    uploadDate: {
        type: Date,
        default: Date.now,
        index: true
    }
});
export const DocumentModel = model("Document", DocumentSchema);
//# sourceMappingURL=Document.model.js.map