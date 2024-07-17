import { db } from "@/db/drizzle";
import { InsertUser, users } from "@/db/schema";
import { desc, sql } from "drizzle-orm";

export const insertUser = async (user: InsertUser) => {
    return await db.insert(users).values(user).returning({
        id: users.id,
        username: users.username,
        email: users.email,
        phone: users.phone,
        isActivated: users.isActivated,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
    });
}

export const selectUserById = async (id: number) => {
    return await db.select().from(users)
        .where(sql`${users.id} = ${id}`);
}

export const selectAllUserWithoutCurrentUser = async (id: number) => {
    return await db.select().from(users)
        .where(sql`${users.id} != ${id}`).orderBy(desc(users.createdAt));
}

export const selectUserByEmail = async (email: string) => {
    return await db.select().from(users)
        .where(sql`${users.email} = ${email}`);
}