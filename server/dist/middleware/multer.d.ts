import { type Multer } from "multer";
import { v2 as cloudinary } from "cloudinary";
import type { RequestHandler } from "express";
export { cloudinary };
declare const uploads: Multer;
export declare const formParser: RequestHandler;
export declare const fileUpload: RequestHandler;
export declare const fileUploadAny: RequestHandler;
export default uploads;
