import type { Request, Response, NextFunction } from "express";
import { responseError } from "./json.js";

export function handlerError(
    err: Error,
    _: Request,
    res: Response,
    __: NextFunction,
) {
    console.log(err.message);
    responseError(res, 500, "Something went wrong on our end");
}
