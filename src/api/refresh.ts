import type { Request, Response } from "express";

import { ErrorUnauthorized } from "./errors.js";
import { responseJSON } from "./json.js";
import { getBearerToken, makeJWT } from "../auth.js";
import { config } from "../config.js";
import { getUserByRefreshToken } from "../db/queries/refresh.js";

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
