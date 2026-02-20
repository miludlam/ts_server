import type { Request, Response } from "express";

import { ErrorBadRequest, ErrorUnauthorized } from "./errors.js";
import { responseJSON } from "./json.js";
import { getBearerToken, hashPassword, validateJWT } from "../auth.js";
import { config } from "../config.js";
import { NewUser } from "../db/schema.js";
import { createUser, getUserByEmail, updateUser}  from "../db/queries/users.js";

export type UserResponse = Omit<NewUser, "hashedPassword">;

export async function handlerCreateUser(req: Request, res: Response) {
    type parameters = {
        email: string;
        password: string;
    };
    const params: parameters = req.body;

    if (!params.email || !params.password) {
        throw new ErrorBadRequest("Missing required fields");
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

export async function handlerUpdateUser(req: Request, res: Response) {
    type parameters = {
        email: string;
        password: string;
    };

    const bearerToken = getBearerToken(req);
    const userID = validateJWT(bearerToken, config.jwt.secret);

    const params: parameters = req.body;

    if (!params.email || !params.password) {
        throw new ErrorBadRequest("Missing required fields");
    }

    const hashedPassword = await hashPassword(params.password);

    const updatedUser = await updateUser(userID, {
        email: params.email,
        hashedPassword: hashedPassword,
    } satisfies NewUser);

    responseJSON(res, 200, {
        id: updatedUser.id,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
    } satisfies UserResponse);
}
