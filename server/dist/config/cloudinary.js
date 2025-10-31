"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamUpload = void 0;
const stream_1 = require("stream");
const multer_1 = require("../middleware/multer");
const streamUpload = (file) => {
    return new Promise((resolve, reject) => {
        if (!file.buffer)
            return reject(new Error('No file buffer'));
        const folder = file.mimetype.startsWith('image/') ? 'images' : 'media';
        const uploadStream = multer_1.cloudinary.uploader.upload_stream({
            upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
            resource_type: 'auto',
            folder
        }, (error, result) => {
            if (error || !result) {
                return reject(error ?? new Error('Cloudinary upload failed'));
            }
            console.log(result.secure_url, ': secureUrl', result.public_id, ": public_id");
            resolve({ secure_url: result.secure_url, public_id: result.public_id, bytes: result.bytes ?? file.size });
        });
        const bufferStream = new stream_1.PassThrough();
        bufferStream.end(file.buffer);
        bufferStream.pipe(uploadStream);
    });
};
exports.streamUpload = streamUpload;
//# sourceMappingURL=cloudinary.js.map