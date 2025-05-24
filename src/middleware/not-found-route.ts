import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const notFoundRoute = (req: Request, res: Response, _next: NextFunction): void => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: `API Not Found: ${req.originalUrl}`,
        error: `The requested URL ${req.originalUrl} was not found on this server.`,
    });
};

export default notFoundRoute;
