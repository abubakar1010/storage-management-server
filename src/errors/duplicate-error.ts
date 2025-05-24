import { TErrorSources, TGenericErrorResponse } from "../types/error";

const handleDuplicateError = (err: unknown): TGenericErrorResponse => {
    const match = (err as { message: string }).message.match(/"([^"]*)"/);

    const extractedMessage = match && match[1];

    const errorSources: TErrorSources = [
        {
            path: "",
            message: `${extractedMessage} is already exists`,
        },
    ];

    const statusCode = 400;

    return {
        statusCode,
        message: "Oops! This value is already taken. Try something different.",
        errorSources,
    };
};

export default handleDuplicateError;
