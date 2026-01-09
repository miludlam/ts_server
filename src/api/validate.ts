import type { Request, Response } from "express";

import { responseError, responseJSON } from "./json.js";

export async function handlerValidate(req: Request, res: Response) {
    type parameters = {
        body: string;
    };

    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
    });

    let params: parameters;
    req.on("end", () => {
        try {
            params = JSON.parse(body);
        } catch (e) {
            responseError(res, 400, "Invalid JSON");
            return;
        }
        const maxChirpLength = 140;
        if (params.body.length > maxChirpLength) {
            responseError(res, 400, "Chirp is too long");
            return;
        }

        responseJSON(res, 200, {
            valid: true,
        });
    });
}
