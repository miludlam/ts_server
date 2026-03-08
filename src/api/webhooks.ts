import type { Request, Response } from "express";
import { upgradeUser } from "../db/queries/users.js";

export async function handlerUpgradeUser(req: Request, res: Response) {
    type parameters = {
        event: string;
        data: {
            userId: string;
        }
    };

    const params: parameters = req.body;

    if (params.event !== "user.upgraded") {
        res.status(204).send();
        return;
    }
    if (params.event === "user.upgraded") {
        const result = await upgradeUser(params.data.userId);
        if (!result) {
            res.status(404).send();
        }
    }
    res.status(204).send();
}
