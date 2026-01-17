import type { Request, Response } from "express";

import { createChirp } from "../db/queries/chirps.js";
import { ErrorBadRequest } from "./errors.js";
import { responseJSON } from "./json.js";

export async function handlerCreateChirps(req: Request, res: Response) {
    type parameters = {
        body: string;
        userId: string;
    };

    const params: parameters = req.body;

    const cleaned = validateAndCensor(params.body);
    const chirp = await createChirp({body: cleaned, userId: params.userId});
    if (!chirp) {
        throw new Error("Chirp could not be created");
    }

    responseJSON(res, 201, chirp);
}

function validateAndCensor(input: string): string {
    const maxChirpLength = 140;
    if (input.length > maxChirpLength) {
        throw new ErrorBadRequest("Chirp is too long. Max length is 140");
    }

    const badWords = ["kerfuffle", "sharbert", "fornax"];
    const pattern = new RegExp(`\\b(${badWords.join("|")})\\b`, "gi");
    return input.replace(pattern, "****");
}
