import type { Request, Response } from "express";

import { responseError, responseJSON } from "./json.js";

export async function handlerValidate(req: Request, res: Response) {
    type parameters = {
        body: string;
    };

    const params: parameters = req.body;

    const maxChirpLength = 140;
    if (params.body.length > maxChirpLength) {
        responseError(res, 400, "Chirp is too long");
        return;
    }
    responseJSON(res, 200, {
        valid: true,
    });
}
