import type { Request, Response } from "express";

import { ErrorBadRequest } from "./errors.js";
import { responseJSON } from "./json.js";

export async function handlerValidate(req: Request, res: Response) {
    type parameters = {
        body: string;
    };

    const params: parameters = req.body;

    const maxChirpLength = 140;
    if (params.body.length > maxChirpLength) {
        throw new ErrorBadRequest("Chirp is too long. Max length is 140");
    }

    const cleanedBody = censor(params.body);
    responseJSON(res, 200, {
        cleanedBody: cleanedBody,
    });
}

function censor(input: string): string {
    const badWords = ["kerfuffle", "sharbert", "fornax"];
    const pattern = new RegExp(`\\b(${badWords.join("|")})\\b`, "gi");
    return input.replace(pattern, "****");
}
