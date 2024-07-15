import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

config({ path: ".env.local" });

const client = new Client({
    connectionString: process.env.DB_CONNECTION_STRING!,
});

(async () => {
    await client.connect();
})()

export const db = drizzle(client);
