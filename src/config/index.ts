import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const config = {
    port: process.env.PORT || 3000,
    db_uri: process.env.DB_URI,
};
