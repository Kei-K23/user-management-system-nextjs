import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { generateRandomNumber } from "@/lib/utils";
import { sendEmail } from "@/services/mail/mail-backend";
import VerificationTokenEmail from "@/services/mail/verification-email";
import { insertUser, selectAllUserWithoutCurrentUser, selectUserById } from "@/services/user";
import { insertVerificationToken } from "@/services/verification-token";
import { EmailCategory } from "@/types";
import { render } from "@react-email/components";
import * as argon2 from "argon2";
import { eq } from "drizzle-orm";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: Request) {
    const jsonData = await request.json();
    const username = jsonData.username;
    const email = jsonData.email;
    const phone = jsonData.phone;
    const password = jsonData.password;

    // Check validation for form data
    if (!username || !email || !phone || !password) {
        return Response.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // Hash the password
    const hashPassword = await argon2.hash(password);
    // Insert user to your database here
    const newUser = await insertUser({
        username: username,
        email,
        phone,
        password: hashPassword,
    });

    // Generate a random verification token
    const verificationToken = generateRandomNumber();

    // Create a new user account verification token
    await insertVerificationToken({
        userId: newUser[0].id,
        token: verificationToken,
        category: EmailCategory.EMAIL_VERIFICATION
    });

    // Render email template
    const emailHtml = render(VerificationTokenEmail({ verificationCode: verificationToken }));

    // Send email
    sendEmail({
        emailHtml,
        subject: "Account Verification",
        to: email
    });

    return Response.json({ data: newUser }, { status: 201 });
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId');

    if (!userId) {
        return Response.json({ error: "Missing user id" }, { status: 401 });
    }

    const existingUser = await selectUserById(+userId);

    if (!existingUser.length) {
        return Response.json({ error: "User not found to update" }, { status: 404 });
    }

    const users = await selectAllUserWithoutCurrentUser(+userId);
    return Response.json({ data: users }, { status: 200 });
}

export async function DELETE(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId');
    const cookieStore = cookies()
    const jwtToken = cookieStore.get('ums-jwt-token')


    if (!userId) {
        return Response.json({ error: "Missing user id" }, { status: 401 });
    }

    const existingUser = await selectUserById(+userId);

    if (!existingUser.length) {
        return Response.json({ error: "User not found to update" }, { status: 404 });
    }


    if (!jwtToken) {
        return Response.json({ error: 'Missing JWT token' }, { status: 401 });
    }
    // Verify the token
    const { payload } = await jwtVerify(jwtToken.value, new TextEncoder().encode(process.env.JWT_SECRET_KEY!));

    // Check payload for any reason it not exists
    if (!payload) {
        return Response.json({ error: 'Missing JWT payload' }, { status: 401 });
    }

    // Check if the token has expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp! < currentTime) {
        return Response.json({ error: 'Expired JWT token' }, { status: 401 });
    }

    await db.delete(users).where(eq(users.id, +userId));

    if (payload.userId == userId) {
        // Delete the cookie and logout
        cookies().delete('ums-jwt-token');
        return Response.json({ message: "Successfully delete the user", ownAccount: 1 }, { status: 200 });
    }

    return Response.json({ message: "Successfully delete the user", ownAccount: 0 }, { status: 200 });
}


export async function PUT(request: NextRequest) {
    const jsonData = await request.json();
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId');
    const username = jsonData.username;
    const email = jsonData.email;
    const phone = jsonData.phone;
    const role = jsonData.role;

    if (!userId) {
        return Response.json({ error: "Missing user id" }, { status: 401 });
    }

    if (!username || !email || !phone) {
        return Response.json({ error: "Invalid request data" }, { status: 400 });
    }

    const existingUser = await selectUserById(+userId);


    if (!existingUser.length) {
        return Response.json({ error: "User not found to update" }, { status: 404 });
    }

    const updatedUser = await db.update(users).set({
        email,
        phone,
        username,
        role: role || existingUser[0].role
    }).where(eq(users.id, +userId));

    return Response.json({ data: updatedUser }, { status: 200 });
}