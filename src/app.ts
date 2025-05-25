import express, { Request, Response } from "express";
import cors from "cors";
import router from "./routes/route";
import globalErrorHandler from "./middleware/global-error-handler";
import notFoundRoute from "./middleware/not-found-route";

const app = express();

// express middleware

app.use(
    cors({
        origin: ["*"],
        credentials: true,
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "SERVER CONNECTED" });
});

// routes

app.use("/api", router);

// global error handler
app.use(globalErrorHandler);
// not found
app.use(notFoundRoute);

export default app;
