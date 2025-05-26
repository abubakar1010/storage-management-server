import { Types } from "mongoose";
import { IAsset } from "../assets/assets.interface";

export interface IFolder {
    userId: Types.ObjectId;
    name: string;
    parentId?: Types.ObjectId | null;
    size: number;
    assets: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICreateFolderResponse {
    folderId: Types.ObjectId;
    name: string;
    size: string;
}

export interface IPreviewFolderResponse {
    folderId: Types.ObjectId;
    name: string;
    parentId?: Types.ObjectId | null;
    size: string;
    assets: IAsset[];
    childFolders?: IPreviewFolderResponse[];
}
