// 400
export class ErrorBadRequest extends Error {
    constructor(message: string) {
        super(message);
    }
}
// 401
export class ErrorUnauthorized extends Error {
    constructor(message: string) {
        super(message);
    }
}
// 403
export class ErrorForbidden extends Error {
    constructor(message: string) {
        super(message);
    }
}
// 404
export class ErrorNotFound extends Error {
    constructor(message: string) {
        super(message);
    }
}
