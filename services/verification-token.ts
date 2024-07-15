import { db } from "@/db/drizzle";
import { InsertVerificationToken, verificationTokens } from "@/db/schema";

export const insertVerificationToken = async (token: InsertVerificationToken) => {
    return db.insert(verificationTokens).values(token).returning();
}
