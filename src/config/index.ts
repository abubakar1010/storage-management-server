import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const config = {
    port: process.env.PORT || 3000,
    node_env: process.env.NODE_ENV || "development",
    db_uri: process.env.DB_URI,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_secret: process.env.ACCESS_TOKEN_SECRET,
    jwtExpiry: process.env.ACCESS_TOKEN_EXPIRES_IN,
    user_email: process.env.USER_EMAIL,
    user_password: process.env.USER_PASSWORD,
    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
};
