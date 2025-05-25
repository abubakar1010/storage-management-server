import jwt, { SignOptions } from "jsonwebtoken";

export const GenerateToken = (
    jwtPayload: { _id: string },
    secret: string,
    expiresIn: SignOptions["expiresIn"],
): string => {
    const options: SignOptions = {
        expiresIn,
    };

    return jwt.sign(jwtPayload, secret, options);
};
