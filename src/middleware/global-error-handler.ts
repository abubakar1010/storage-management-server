import { ErrorRequestHandler, NextFunction } from "express";
import { config } from "../config";
import { TErrorSources } from "../types/error";
import { ZodError } from "zod";
import { handleZodError } from "../errors/zod-error";
import handleValidationError from "../errors/validation-error";
import handleCastError from "../errors/cast-error";
import handleDuplicateError from "../errors/duplicate-error";
import ApiError from "../utils/ApiError";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, _next: NextFunction) => {
    let statusCode = 500;
    let message = "Something went wrong!";
    let errorSources: TErrorSources = [
        {
            path: "",
            message: "Something went wrong",
        },
    ];

    if (err instanceof ZodError) {
        const zodErrorInfo = handleZodError(err);
        statusCode = zodErrorInfo.statusCode;
        message = zodErrorInfo.message;
        errorSources = zodErrorInfo.errorSources;
    } else if (err?.name === "ValidationError") {
        const validationError = handleValidationError(err);
        statusCode = validationError?.statusCode;
        message = validationError?.message;
        errorSources = validationError?.errorSources;
    } else if (err?.name === "CastError") {
        const castError = handleCastError(err);
        statusCode = castError?.statusCode;
        message = castError?.message;
        errorSources = castError?.errorSources;
    } else if (err?.code === 11000) {
        const duplicateKeyError = handleDuplicateError(err);
        statusCode = duplicateKeyError?.statusCode;
        message = duplicateKeyError?.message;
        errorSources = duplicateKeyError?.errorSources;
    } else if (err instanceof ApiError) {
        statusCode = err?.statusCode;
        message = err.message;
        errorSources = [
            {
                path: "",
                message: err?.message,
            },
        ];
    } else if (err instanceof Error) {
        message = err.message;
        errorSources = [
            {
                path: "",
                message: err?.message,
            },
        ];
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err,
        stack: config.node_env === "development" ? err?.stack : null,
    });
};

export default globalErrorHandler;
