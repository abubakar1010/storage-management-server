import { model, Schema } from "mongoose";
import { IFolder } from "./folder.interface";

const folderSchema = new Schema<IFolder>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        parentId: {
            type: Schema.Types.ObjectId,
            ref: "Folder", 
            default: null,
        },
        size: {
            type: Number,
            default: 0, 
        },
        assets: [
            {
                type: Schema.Types.ObjectId,
                ref: "Asset",
            },
        ],
    },
    { timestamps: true },
);

export const Folder = model<IFolder>("Folder", folderSchema);
