import type { Response } from "express";

export function responseError(res: Response, code: number, message: string) {
    responseJSON(res, code, { error: message });
}

export function responseJSON(res: Response, code: number, payload: any) {
    res.header("Content-Type", "application/json");
    const body = JSON.stringify(payload);
    res.status(code).send(body);
}
