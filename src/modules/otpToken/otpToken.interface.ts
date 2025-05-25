import { Types } from "mongoose";

export interface IOTPToken {
    userId: Types.ObjectId;
    otp: string;
    expiresAt: Date;
    used: boolean;
    createdAt: Date;
    updatedAt: Date;
}
