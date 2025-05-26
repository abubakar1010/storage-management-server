import { Types } from "mongoose";

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
