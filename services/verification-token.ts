import { db } from "@/db/drizzle";
import { InsertVerificationToken, verificationTokens } from "@/db/schema";
import { sql } from "drizzle-orm";

export const insertVerificationToken = async (token: InsertVerificationToken) => {
    return db.insert(verificationTokens).values(token).returning();
}

export const selectVerificationTokenByToken = async (token: number, userId: number, category: EmailCategory) => {
    return await db.select().from(verificationTokens)
        .where(sql`${verificationTokens.token} = ${token} 
            and now() < ${verificationTokens.expiredAt} 
            and ${verificationTokens.userId} = ${userId} 
            and ${verificationTokens.category} = ${category}`);
}