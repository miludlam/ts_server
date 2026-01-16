import type { Request, Response } from "express";
import { ErrorForbidden } from "./errors.js";
import { deleteAllUsers } from "../db/queries/users.js";
import { config } from "../config.js";

export async function handlerReset(_: Request, res: Response) {
    if (config.api.platform !== "dev") {
        throw new ErrorForbidden("Reset is only allowed in dev mode");
    }
    config.api.fileServerHits = 0;
    await deleteAllUsers();
    res.write("Hits reset to 0");
    res.end();
}
