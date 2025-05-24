import { Model } from "mongoose";

type AssetID = string;

export interface IFolder {
    title: string;
    assets: AssetID[];
}

export interface IStorage {
    totalStorage: number;
    usagesStorage: number;
    availableStorage: number;
}

export interface IUser {
    username: string;
    email: string;
    password: string;
    storage: IStorage;
    notes: AssetID[];
    images: AssetID[];
    pdfs: AssetID[];
    folders: IFolder[];
    favorite: AssetID[];
    private: AssetID[];
    secretKey: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserModel extends Model<IUser> {
    //if passwords are matched
    isPasswordMatched(password: string, hashedPassword: string): Promise<boolean>;
}
