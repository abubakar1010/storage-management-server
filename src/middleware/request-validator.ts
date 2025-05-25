import { RequestHandler } from "express";
import { ZodTypeAny } from "zod";
import asyncHandler from "../utils/asyncHandler";

const requestValidator = (schema: ZodTypeAny): RequestHandler => {
    return asyncHandler(async (req, res, next) => {
        await schema.parseAsync(req.body);
        next();
    });
};

export default requestValidator;
