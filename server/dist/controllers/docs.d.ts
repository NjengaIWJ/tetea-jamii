import type { Request, Response } from "express";
type ApiResponse<T = unknown> = {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
};
/**
 * POST /documents
 * Expects multipart form with: title, file (single file via multer memoryStorage)
 */
export declare const createDocument: (req: Request, res: Response<ApiResponse>) => Promise<Response<ApiResponse<unknown>, Record<string, any>>>;
/**
 * GET /documents/:id
 * Returns Cloudinary URL (redirect) so client downloads directly from Cloudinary
 */
export declare const getDocumentById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * GET /documents
 * List documents with pagination
 */
export declare const listDocuments: (req: Request, res: Response<ApiResponse>) => Promise<Response<ApiResponse<unknown>, Record<string, any>>>;
/**
 * DELETE /documents/:id
 * Remove Cloudinary asset then DB record
 */
export declare const deleteDocumentById: (req: Request, res: Response<ApiResponse>) => Promise<Response<ApiResponse<unknown>, Record<string, any>>>;
export {};
