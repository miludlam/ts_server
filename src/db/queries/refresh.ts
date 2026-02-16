import { db } from "../index.js";
import { refreshTokens } from "../schema.js";

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
