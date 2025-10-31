import type { Request, Response } from "express";
type ApiResponse<T = unknown> = {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
};
declare const createArticle: (req: Request, res: Response<ApiResponse<{
    id: string;
    media: {
        url: string;
        publicId: string;
    }[];
}>>) => Promise<Response<ApiResponse<{
    id: string;
    media: {
        url: string;
        publicId: string;
    }[];
}>, Record<string, any>>>;
declare const getArticles: (req: Request, res: Response) => Promise<void>;
declare const getArticleById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const updateArticle: (req: Request, res: Response) => Promise<void>;
declare const deleteArticle: (req: Request, res: Response) => Promise<void>;
export { createArticle, getArticles, getArticleById, updateArticle, deleteArticle, };
