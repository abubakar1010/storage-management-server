/* eslint-disable no-console */
import mongoose from "mongoose";
import app from "./app";
import { config } from "./config";

async function main(): Promise<void> {
    try {
        const connectionInstance = await mongoose.connect(config.db_uri!);
        console.log(
            "Database is successfully connected!! host on",
            connectionInstance.connection.host,
        );
        app.listen(config.port, () => {
            console.log("server running on port", config.port);
        });
    } catch (error) {
        console.log("Oops! Connection failed", error);
    }
}
main();
