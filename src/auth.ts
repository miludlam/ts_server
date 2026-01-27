import argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { ErrorUnauthorized } from "./api/errors";

export async function hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    if (!password) return false;
    try {
        return await argon2.verify(hash, password);
    } catch {
        return false;
    }
}

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string) {
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresAt = issuedAt + expiresIn;
    const user: payload = {
        iss: "chirpy",
        sub: userID,
        iat: issuedAt,
        exp: expiresAt,
    };
    return jwt.sign(user, secret);
}

export function validateJWT(tokenString: string, secret: string) {
    let decoded: payload;

    try {
        decoded = jwt.verify(tokenString, secret) as JwtPayload;
    } catch (err) {
        throw new ErrorUnauthorized("Invalid token");
    }

    if (decoded.iss !== "chirpy") {
        throw new ErrorUnauthorized("Invalid issuer");
    }
    if (!decoded.sub) {
        throw new ErrorUnauthorized("No user ID in token");
    }
    return decoded.sub;
}