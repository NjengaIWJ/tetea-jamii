import { Schema } from "mongoose";
declare const Story: import("mongoose").Model<{
    media: string[];
    title: string;
    content: string;
    mediaPublicIds: string[];
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    media: string[];
    title: string;
    content: string;
    mediaPublicIds: string[];
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    media: string[];
    title: string;
    content: string;
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
    media: string[];
    title: string;
    content: string;
    mediaPublicIds: string[];
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    media: string[];
    title: string;
    content: string;
    mediaPublicIds: string[];
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    media: string[];
    title: string;
    content: string;
    mediaPublicIds: string[];
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
export default Story;
