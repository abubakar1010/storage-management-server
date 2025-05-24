
interface TMeta {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
}

interface TResponse<T> {
    statusCode: number;
    success?: boolean;
    message?: string;
    meta?: TMeta;
    data: T;
}

class ApiResponse<T> {
    statusCode: number;
    success?: boolean;
    message?: string;
    meta?: TMeta;
    data: T;

    constructor({ statusCode, success, message, data, meta }: TResponse<T>) {
        this.statusCode = statusCode;
        this.success = success;
        this.message = message;
        this.data = data;
        this.meta = meta;
    }
}

export default ApiResponse;
