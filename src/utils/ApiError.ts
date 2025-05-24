class ApiError extends Error {
    public statusCode: number;
    public message: string;
    constructor(statusCode: number, message: string = "something went wrong", stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.message = message;

        if (this.stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;
