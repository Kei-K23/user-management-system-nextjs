import { db } from "@/db/drizzle";
import { InsertVerificationToken, verificationTokens } from "@/db/schema";
import { sql } from "drizzle-orm";

export const insertVerificationToken = async (token: InsertVerificationToken) => {
    return db.insert(verificationTokens).values({
        token: token.token,
        userId: token.userId,
        category: token.category,
    }).returning();
}

export const selectVerificationTokenByToken = async (token: number, category: string) => {
    return await db.select().from(verificationTokens)
        .where(sql`${verificationTokens.token} = ${token} 
            and now() < ${verificationTokens.expiredAt} 
            and ${verificationTokens.category} = ${category}`);
}