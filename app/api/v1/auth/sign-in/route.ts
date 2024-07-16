import { selectUserByEmail } from "@/services/user";
import * as argon2 from "argon2";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    const jsonData = await request.json();
    const email = jsonData.email;
    const password = jsonData.password;
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 24 * 60 * 60; // one day (24 hours)

    // Check validation for form data
    if (!email || !password) {
        return Response.json({ error: 'Invalid request data' }, { status: 400 });
    }

    const user = await selectUserByEmail(email);
    if (!user.length || user.length <= 0) {
        return Response.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (!user[0].isActivated) {
        return Response.json({ error: 'User account is not activated yet' }, { status: 401 });
    }

    const validPassword = await argon2.verify(user[0].password, password);

    if (!validPassword) {
        return Response.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = await new SignJWT({ userId: user[0].id, email: user[0].email, role: user[0].role })
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

    return Response.json({ token }, { status: 200 });
}