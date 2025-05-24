import { RequestHandler } from "express";

const asyncHandler = (requestHandler: RequestHandler): RequestHandler => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((error) => next(error));
    };
};

export default asyncHandler;
