import { db } from "@/db/drizzle";
import { users, verificationTokens } from "@/db/schema";
import { selectUserById } from "@/services/user";
import { selectVerificationTokenByToken } from "@/services/verification-token";
import { EmailCategory } from "@/types";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
    const jsonData = await request.json();
    const code = jsonData.code;

    // Check validation
    if (!code) {
        return Response.json({ error: 'Invalid request data' }, { status: 400 });
    }

    const token = await selectVerificationTokenByToken(code, EmailCategory.EMAIL_VERIFICATION);

    if (!token.length) {
        return Response.json({ error: 'Verification code is invalid or expired' }, { status: 401 });
    }

    // TODO: handle user existing
    const user = await selectUserById(token[0].userId);

    if (!user.length) {
        return Response.json({ error: 'Invalid user' }, { status: 401 });
    }

    // Update the verification token
    await db.update(verificationTokens).set({
        validatedAt: new Date(new Date().getTime())
    }).where(eq(verificationTokens.id, token[0].id));

    // Activate the user account in your database here
    await db.update(users).set({
        isActivated: true
    }).where(eq(users.id, token[0].userId));

    return Response.json({ message: "Successfully verify the user account" }, { status: 200 });
}