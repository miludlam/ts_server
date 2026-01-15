process.loadEnvFile(".env");

type APIConfig = {
    fileServerHits: number;
    dbURL: string;
};

function envOrThrow(key: string): string {
    const value = process.env[key];
    if (!value) throw new Error(`Missing environment variable: ${key}`);
    return value;
}

export const config: APIConfig = {
    fileServerHits: 0,
    dbURL: envOrThrow("DB_URL"),
};
