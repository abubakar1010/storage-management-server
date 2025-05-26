import { Model, Types } from "mongoose";

type AssetID = Types.ObjectId;



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


export interface IStorageOverviewResponse {
    storage: {
        totalStorage: string;
        usagesStorage: string;
        availableStorage: string;
    },
    folder:{
        totalItem: number;
        totalSize: string;
    },
    notes: {
        totalItem: number;
        totalSize: string;
    },
    images: {
        totalItem: number;
        totalSize: string;
    },
    pdfs: {
        totalItem: number;
        totalSize: string;
    }
}