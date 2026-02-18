import { and, eq, gt, isNull } from "drizzle-orm";

import { db } from "../index.js";
import { refreshTokens, users } from "../schema.js";

export async function saveRefreshToken(userID: string, token: string, expiresAt: Date) {
    const result = await db
        .insert(refreshTokens)
        .values({
            userId: userID,
            token: token,
            expiresAt: expiresAt,
            revokedAt: null,
        })
        .returning();

    return result.length > 0;
}

export async function getUserByRefreshToken(token: string) {
    const [result] = await db
        .select({ user: users })
        .from(users)
        .innerJoin(refreshTokens, eq(users.id, refreshTokens.userId))
        .where(
            and(
                eq(refreshTokens.token, token),
                gt(refreshTokens.expiresAt, new Date()),
                isNull(refreshTokens.revokedAt)
            )
        )
        .limit(1);

    return result;
}

export async function revokeRefreshToken() {

}
