import type { Request, Response } from "express";
import { getBearerToken } from "../auth.js";

export async function handlerRefresh(req: Request, res: Response) {
    const bearerToken = getBearerToken(req);


}
