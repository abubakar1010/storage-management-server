import ApiError from "../../utils/ApiError";
import { User } from "./user.model";
import httpStatus from "http-status";

const changePassword = async (
    userId: string,
    currentPassword: string,
    newPassword: string,
): Promise<{ message: string }> => {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    // Check if the current password is correct
    const isCurrentPasswordValid = await User.isPasswordMatched(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Credentials");
    }

    // Update the user's password
    user.password = newPassword;
    await user.save();

    return { message: "Password changed successfully" };
};

const changeUsername = async (
    currentUsername: string,
    newUsername: string,
): Promise<{ username: string }> => {
    const user = await User.findOne({ username: currentUsername });

    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid username");
    }

    user.username = newUsername;

    await user.save();

    return {
        username: user.username,
    };
};

export const userService = {
    changePassword,
    changeUsername
};
