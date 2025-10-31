import { Schema } from "mongoose";
declare const Story: import("mongoose").Model<{
    title: string;
    content: string;
    media: string[];
    mediaPublicIds: string[];
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    title: string;
    content: string;
    media: string[];
    mediaPublicIds: string[];
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    title: string;
    content: string;
    media: string[];
    mediaPublicIds: string[];
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    title: string;
    content: string;
    media: string[];
    mediaPublicIds: string[];
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    title: string;
    content: string;
    media: string[];
    mediaPublicIds: string[];
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    title: string;
    content: string;
    media: string[];
    mediaPublicIds: string[];
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
export default Story;
