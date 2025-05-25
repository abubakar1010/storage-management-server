import { model, Schema } from "mongoose";
import { IOTPToken } from "./otpToken.interface";
import { config } from "../../config";
import bcrypt from "bcrypt";

const otpTokenSchema = new Schema<IOTPToken>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        otp: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        used: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

// Index to automatically delete expired OTP tokens

otpTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

otpTokenSchema.pre("save", async function (next) {
    this.otp = await bcrypt.hash(this.otp, Number(config.bcrypt_salt_rounds));
    next();
});

export const OTPToken = model<IOTPToken>("OTPToken", otpTokenSchema);
