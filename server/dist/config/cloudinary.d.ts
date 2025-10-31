export declare const streamUpload: (file: Express.Multer.File) => Promise<{
    secure_url: string;
    public_id: string;
    bytes: number;
}>;
