import { sql } from 'drizzle-orm';
import { boolean, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable("users", {
    id: serial('id').primaryKey(),
    username: text("username").notNull(),
    email: text("email").unique(),
    phone: text("phone").notNull(),
    password: text("password").notNull(),
    isActivated: boolean('is_activated').default(false),
    role: text("role").default("USER"),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').default(sql`now()`),
});

export type InsertUser = typeof users.$inferInsert;