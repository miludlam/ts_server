import type { Request, Response } from "express";
import { responseJSON } from "./json.js";
import { ErrorBadRequest } from "./errors.js";
import { createUser } from "../db/queries/users.js";

export async function handlerCreateUser(req: Request, res: Response) {
    if (!req.body.email) {
        throw new ErrorBadRequest("Email is required");
    }

    const user = await createUser({email: req.body.email})
    responseJSON(res, 201, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    });
}
