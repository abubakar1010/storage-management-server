import { RequestHandler } from "express";
import { AnyZodObject } from "zod";
import asyncHandler from "../utils/asyncHandler";

const requestValidator = (schema: AnyZodObject): RequestHandler => {
    return asyncHandler(async (req, res, next) => {
        await schema.parseAsync(req.body);
        next();
    });
};

export default requestValidator;
