/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";
import { IFolder, IStorage, IUser, UserModel } from "./user.interface";
import { config } from "../../config";

const FolderSchema = new Schema<IFolder>(
    {
        title: {
            type: String,
            required: true,
        },

        assets: [
            {
                type: String,
                required: true,
            },
        ],
    },
    {
        _id: false,
    },
);

const StorageSchema = new Schema<IStorage>(
    {
        totalStorage: {
            type: Number,
            default: 0,
        },
        usagesStorage: {
            type: Number,
            default: 0,
        },
        availableStorage: {
            type: Number,
            default: 0,
        },
    },
    {
        _id: false,
    },
);

const UserSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },

        storage: {
            type: StorageSchema,
            default: {},
        },

        notes: [
            {
                type: String,
                default: [],
            },
        ],
        images: [
            {
                type: String,
                default: [],
            },
        ],
        pdfs: [
            {
                type: String,
                default: [],
            },
        ],
        folders: {
            type: [FolderSchema],
            default: [],
        },

        favorite: [
            {
                type: String,
                default: [],
            },
        ],
        private: [
            {
                type: String,
                default: [],
            },
        ],
        secretKey: {
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

UserSchema.pre("save", async function (next) {
    const user = this;
    user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt_rounds));
    next();
});

UserSchema.post("save", function (doc, next) {
    doc.password = "";
    next();
});
UserSchema.statics.isPasswordMatched = async function (password, hashedPassword): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
};

export const User = model<IUser, UserModel>("User", UserSchema);
