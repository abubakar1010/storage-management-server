export interface IUserRegistration {
    username: string;
    email: string;
    password: string;
}

export interface IUserLogin {
    email: string;
    password: string;
}

export interface IPasswordOperationResponse {
    message: string;
}
