import type { Request, Response } from "express";

import type { UserResponse } from "./users.js";

import { ErrorUnauthorized } from "./errors.js";
import { responseJSON } from "./json.js";
import { checkPasswordHash, getBearerToken, makeJWT, makeRefreshToken } from "../auth.js";
import { config } from "../config.js";
import { getUserByEmail } from "../db/queries/users.js";
import { getUserByRefreshToken, revokeRefreshToken, saveRefreshToken } from "../db/queries/refresh.js";

type LoginResponse = UserResponse & {
    token: string
    refreshToken: string;
}

export async function handlerLogin(req: Request, res: Response) {
    type parameters = {
        email: string;
        password: string;
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

    // JWT access token
    let duration = config.jwt.defaultDuration; // one hour in seconds
    const token = makeJWT(user.id, duration, config.jwt.secret);
    // refresh token
    let durationDaysInMS = duration * 24 * 60 * 1000; // 60 days in milliseconds
    let expireDate = new Date(Date.now() + durationDaysInMS); // 60 days from now
    const refToken = makeRefreshToken();
    await saveRefreshToken(user.id, refToken, expireDate);

    responseJSON(res, 200, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        token: token,
        refreshToken: refToken,
    } satisfies LoginResponse);
}

export async function handlerRefresh(req: Request, res: Response) {
    const bearerToken = getBearerToken(req);
    const result = await getUserByRefreshToken(bearerToken);
    if (!result) {
        throw new ErrorUnauthorized("Invalid refresh token");
    }

    let duration = config.jwt.defaultDuration; // one hour in seconds
    const token = makeJWT(result.user.id, duration, config.jwt.secret);

    responseJSON(res, 200, {
        token: token,
    });
}

export async function handlerRevoke(req: Request, res: Response) {
    const bearerToken = getBearerToken(req);
    await revokeRefreshToken(bearerToken);

    res.status(204).send();
}
