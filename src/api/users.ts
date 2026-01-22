import type { Request, Response } from "express";

import { createUser } from "../db/queries/users.js";
import { hashPassword } from "./auth.js";
import { ErrorBadRequest } from "./errors.js";
import { responseJSON } from "./json.js";

export async function handlerCreateUser(req: Request, res: Response) {
    type parameters = {
        email: string;
        password: string;
    };
    const params: parameters = req.body;

    if (!params.email) {
        throw new ErrorBadRequest("Email is required");
    }
    if (!params.password) {
        throw new ErrorBadRequest("Password is required");
    }

    const hashedPassword = await hashPassword(params.password);

    const user = await createUser({email: params.email, hashed_password: hashedPassword});
    if (!user) {
        throw new Error("User could not be created");
    }

    responseJSON(res, 201, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    });
}
