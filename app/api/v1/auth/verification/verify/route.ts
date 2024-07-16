import { db } from "@/db/drizzle";
import { users, verificationTokens } from "@/db/schema";
import { selectVerificationTokenByToken } from "@/services/verification-token";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
    const jsonData = await request.json();
    const code = jsonData.code;
    const userId = jsonData.userId;

    // Check validation for form data
    if (!code) {
        return Response.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // Insert user to your database here
    const token = await selectVerificationTokenByToken(code, userId);

    if (!token.length) {
        return Response.json({ error: 'Invalid verification code or expired verification code' }, { status: 401 });
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