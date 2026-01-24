import type { Request, Response } from "express";

import { createUser } from "../db/queries/users.js";
import { ErrorBadRequest } from "./errors.js";
import { responseJSON } from "./json.js";
import { NewUser } from "src/db/schema.js";
import { hashPassword } from "../auth.js";

export type UserResponse = Omit<NewUser, "hashedPassword">;

export async function handlerCreateUser(req: Request, res: Response) {
    type parameters = {
        email: string;
        password: string;
    };
    const params: parameters = req.body;

    if (!params.email || !params.password) {
        throw new ErrorBadRequest("Missinrg required fields");
    }

    const hashedPassword = await hashPassword(params.password);

    const user = await createUser({
        email: params.email,
        hashedPassword: hashedPassword
    } satisfies NewUser);

    if (!user) {
        throw new Error("User could not be created");
    }

    responseJSON(res, 201, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    } satisfies UserResponse);
}
