/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { TErrorSources, TGenericErrorResponse } from "../types/error";

const handleDuplicateError = (err: any): TGenericErrorResponse => {
    const duplicatedField = Object.keys(err.keyPattern || {})[0];
    const duplicatedValue = err.keyValue?.[duplicatedField] ?? "unknown";

    const errorSources: TErrorSources = [
        {
            path: duplicatedField,
            message: `${duplicatedField} '${duplicatedValue}' already exists.`,
        },
    ];

    return {
        statusCode: 409,
        message: "Oops! This value is already taken. Try something different.",
        errorSources,
    };
};

export default handleDuplicateError;
