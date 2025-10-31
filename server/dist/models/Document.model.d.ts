import { type Document as MongooseDocument } from "mongoose";
export interface IDocument extends MongooseDocument {
    title: string;
    fileName: string;
    mimetype: string;
    size: number;
    cloudinaryUrl: string;
    cloudinaryPublicId: string;
    uploadDate: Date;
}
export declare const DocumentModel: import("mongoose").Model<IDocument, {}, {}, {}, MongooseDocument<unknown, {}, IDocument, {}, {}> & IDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
