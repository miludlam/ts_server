import type { Request, Response } from "express";
import type { UserResponse } from "./users.js";

import { getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash, makeJWT } from "../auth.js";
import { responseJSON } from "./json.js";
import { ErrorUnauthorized } from "./errors.js";
import { config } from "../config.js";

type LoginResponse = UserResponse & {
    token: string;
}

export async function handlerLogin(req: Request, res: Response) {
    type parameters = {
        email: string;
        password: string;
        expiresInSeconds?: number;
    };
    const params: parameters = req.body;

    const user = await getUserByEmail(params.email);
    if (!user) {
        throw new ErrorUnauthorized("Incorrect email or password");
    }

    const pwMatch = await checkPasswordHash(params.password, user.hashedPassword);
    if (!pwMatch) {
        throw new ErrorUnauthorized("Incorrect email or password");
    }

    let duration = config.jwt.defaultDuration;
    if (params.expiresInSeconds && !(params.expiresInSeconds > duration)) {
        duration = params.expiresInSeconds;
    }

    const token = makeJWT(user.id, duration, config.jwt.secret);

    responseJSON(res, 200, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        token: token,
    } satisfies LoginResponse);
}