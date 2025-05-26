import { Schema, model } from "mongoose";
import { IAsset } from "./assets.interface";

const assetSchema = new Schema<IAsset>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        size: {
            type: Number,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            enum: ["notes", "images", "pdfs"],
        },
        folder: {
            type: String,
            default: "",
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

export const Asset = model<IAsset>("Asset", assetSchema);
