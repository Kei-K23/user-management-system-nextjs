import { db } from "@/db/drizzle";
import { users, verificationTokens } from "@/db/schema";
import { selectUserById } from "@/services/user";
import { selectVerificationTokenByToken } from "@/services/verification-token";
import { eq } from "drizzle-orm";
import * as argon2 from "argon2";
import { EmailCategory } from "@/types";

export async function POST(request: Request) {
    const jsonData = await request.json();
    const code = jsonData.code;
    const password = jsonData.password;

    // Check validation
    if (!code || !password) {
        return Response.json({ error: 'Invalid request data' }, { status: 400 });
    }

    const token = await selectVerificationTokenByToken(code, EmailCategory.PASSWORD_RESET);

    if (!token.length) {
        return Response.json({ error: 'Verification code is invalid or expired' }, { status: 401 });
    }

    // TODO: handle user existing
    const user = await selectUserById(token[0].userId);

    if (!user.length) {
        return Response.json({ error: 'Invalid user' }, { status: 401 });
    }

    if (!user[0].isActivated) {
        return Response.json({ error: 'User account is not activated yet' }, { status: 401 });
    }

    // Update the verification token
    await db.update(verificationTokens).set({
        validatedAt: new Date(new Date().getTime())
    }).where(eq(verificationTokens.id, token[0].id));

    // Hash the password
    const hashPassword = await argon2.hash(password);

    // Update the user account
    await db.update(users).set({
        password: hashPassword
    }).where(eq(users.id, token[0].userId));

    return Response.json({ message: "Successfully reset the user password" }, { status: 200 });
}