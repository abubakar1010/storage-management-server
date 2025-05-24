import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import { config } from "../config";
import { User } from "../modules/user/user.model";

const auth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    // Check if authorization header is provided and starts with "Bearer "

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(
            httpStatus.UNAUTHORIZED,
            "Unauthorized access! Please make sure you are logged in.",
        );
    }

    // Extract token from the authorization header
    const token = authHeader.split(" ")[1];

    // Check if token is provided
    if (!token) {
        throw new ApiError(
            httpStatus.UNAUTHORIZED,
            "Unauthorized access! Please make sure you are verified.",
        );
    }

    // Verify the token

    let decoded;
    try {
        decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
    } catch {
        throw new ApiError(
            httpStatus.UNAUTHORIZED,
            "Unauthorized access! Please make sure you have a valid token.",
        );
    }

    const { _id } = decoded;

    const user = await User.findById(_id).select("-password -__v -createdAt -updatedAt");

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
    }

    // check if user is deleted or not

    if (user.isDeleted) {
        throw new ApiError(
            httpStatus.UNAUTHORIZED,
            "Unauthorized access! This account is deleted.",
        );
    }

    req.user = decoded as JwtPayload & { _id: string };
    next();
});

export default auth;
