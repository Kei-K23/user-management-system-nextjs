import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { selectAllUserWithoutCurrentUser, selectUserById } from "@/services/user";
import { eq } from "drizzle-orm";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

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

    // Delete the user
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
    const cookieStore = cookies();
    const jwtToken = cookieStore.get('ums-jwt-token');
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 24 * 60 * 60; // one day (24 hours)

    if (!userId) {
        return Response.json({ error: "Missing user id" }, { status: 401 });
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
        email: email.trim(),
        phone: phone.trim(),
        username: username.trim(),
        role: role || existingUser[0].role
    }).where(eq(users.id, +userId));

    // Create a new JWT token because of current login user information is updated
    if (payload.userId == userId) {
        const token = await new SignJWT({ userId: existingUser[0].id, email: email.trim(), role: role?.trim() || existingUser[0].role })
            .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
            .setExpirationTime(exp)
            .setIssuedAt(iat)
            .setNotBefore(iat)
            .sign(new TextEncoder().encode(process.env.JWT_SECRET_KEY!));

        cookies().set({
            name: 'ums-jwt-token',
            value: token,
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 86400000, // 1 days
        })
    }

    return Response.json({ data: updatedUser }, { status: 200 });
}