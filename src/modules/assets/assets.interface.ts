import { Types } from "mongoose";

export interface IAsset {
    userId: Types.ObjectId;
    title: string;
    category: "notes" | "images" | "pdfs";
    url: string;
    size: number;
    folder: Types.ObjectId;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUploadAsset {
    userId: string;
    fileName: string;
    filePath: string;
    category: "notes" | "images" | "pdfs";
}

export interface IUploadedAssetResponse {
    title: string;
    category: string;
    url: string;
    size: string;
    createdAt: Date;
}
