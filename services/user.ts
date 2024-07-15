import { db } from "@/db/drizzle";
import { InsertUser, users } from "@/db/schema";

export const insertUser = async (user: InsertUser) => {
    return db.insert(users).values(user).returning({
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
