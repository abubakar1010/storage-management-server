import express, { Request, Response } from "express";
import cors from "cors";
const app = express();

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

export default app;
