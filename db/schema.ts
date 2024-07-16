import { sql } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable("users", {
    id: serial('id').primaryKey(),
    username: text("username").notNull(),
    email: text("email").notNull().unique(),
    phone: text("phone").notNull(),
    password: text("password").notNull(),
    isActivated: boolean('is_activated').default(false),
    role: text("role").default("USER"),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').default(sql`now()`),
});

// Define the verificationTokens table with a foreign key referencing the users table
export const verificationTokens = pgTable("verification_tokens", {
    id: serial('id').primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
    token: integer("token").notNull().unique(),
    category: text("category").notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    expiredAt: timestamp('expired_at').default(sql`now() + interval '10 minutes'`),
    validatedAt: timestamp('validated_at')
});

export type InsertUser = typeof users.$inferInsert;
export type InsertVerificationToken = typeof verificationTokens.$inferInsert;