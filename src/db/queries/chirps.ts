import { asc, desc, eq } from "drizzle-orm";

import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";

export async function createChirp(chirp: NewChirp) {
    const [result] = await db.insert(chirps).values(chirp).returning();
    return result;
}

export async function getAllChirps(sort: string, authorId?: string) {
    return db
        .select()
        .from(chirps)
        .where(authorId ? eq(chirps.userId, authorId) : undefined)
        .orderBy(sort === "desc" ? desc(chirps.createdAt) : asc(chirps.updatedAt));
}

export async function getChirp(id: string) {
    const result = await db.select().from(chirps).where(eq(chirps.id, id));
    if (result.length === 0) {
        return;
    }
    return result[0];
}

export async function deleteChirp(id: string) {
    await db.delete(chirps).where(eq(chirps.id, id));
}
