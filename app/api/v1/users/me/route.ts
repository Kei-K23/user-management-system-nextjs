import { selectUserById } from "@/services/user";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const cookieStore = cookies()
    const jwtToken = cookieStore.get('ums-jwt-token')

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

    const users = await selectUserById(+payload?.userId! as number);

    if (!users.length) {
        return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({ data: users }, { status: 201 });
}
