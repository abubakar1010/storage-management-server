import { Types } from "mongoose";

export interface IFolder  {
    userId: Types.ObjectId;
    name: string;
    parentId?: Types.ObjectId | null;
    assets: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
};

export interface ICreateFolderResponse {
    folderId: Types.ObjectId;
    name: string;
}