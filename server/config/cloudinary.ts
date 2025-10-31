import { PassThrough } from "stream";
import { cloudinary } from "../middleware/multer.ts";

interface CloudinaryUploadResult {
	secure_url: string;
	public_id: string;
}

export const streamUpload = (file: Express.Multer.File): Promise<{ secure_url: string; public_id: string; bytes: number }> => {
	return new Promise((resolve, reject) => {
		if (!file.buffer) return reject(new Error('No file buffer'));
		const folder = file.mimetype.startsWith('image/') ? 'images' : 'media';
		const uploadStream = cloudinary.uploader.upload_stream({
			upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET!,
			resource_type: 'auto',
			folder
		}, (error, result) => {
			if (error || !result) {
				return reject(error ?? new Error('Cloudinary upload failed'));
			}

			console.log(result.secure_url, ': secureUrl', result.public_id, ": public_id");

			resolve({ secure_url: result.secure_url, public_id: result.public_id, bytes: result.bytes ?? file.size });
		});
		const bufferStream = new PassThrough();
		bufferStream.end(file.buffer);
		bufferStream.pipe(uploadStream);
	});
};
