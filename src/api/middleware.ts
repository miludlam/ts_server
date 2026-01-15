import type { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { responseError } from "./json.js";
import {
    ErrorBadRequest,
    ErrorUnauthorized,
    ErrorForbidden,
    ErrorNotFound
} from "./errors.js";

export function middlewareLogResponse(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    res.on("finish", () => {
        const statusCode = res.statusCode;

        if (statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
        }
    });

    next();
}

export function middlewareMetricsInc(
  _: Request,
  __: Response,
  next: NextFunction,
) {
  config.api.fileServerHits++;
    next();
}

export function handlerError(
    err: Error,
    _: Request,
    res: Response,
    __: NextFunction,
) {
    if (err instanceof ErrorBadRequest) {
        responseError(res, 400, err.message);
    } else if (err instanceof ErrorUnauthorized) {
        responseError(res, 401, err.message);
    } else if (err instanceof ErrorForbidden) {
        responseError(res, 403, err.message);
    } else if (err instanceof ErrorNotFound) {
        responseError(res, 404, err.message);
    } else {
        responseError(res, 500, "Internal Server Error");
    }
}

