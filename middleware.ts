import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/sign-in', '/sign-up', '/forgot-password', '/account-verification'];

export async function middleware(request: NextRequest) {
    // TODO: change with actual auth cookie name
    let cookie = request.cookies.get('ums-jwt-token');
    const signInUrl = new URL('/sign-in', request.url)
    const pathname = request.nextUrl.pathname;
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    // If the pathname is public then pass the authentication
    if (isPublicRoute) {
        return NextResponse.next();
    }

    // Check if the pathname is not public and not auth cookie exists, then redirect to sign in page
    if (!cookie || !cookie.value) {
        return NextResponse.redirect(signInUrl);
    }

    try {
        // Verify the token
        const { payload } = await jwtVerify(cookie.value, new TextEncoder().encode(process.env.JWT_SECRET_KEY!));

        // Check payload for any reason it not exists
        if (!payload) {
            return NextResponse.redirect(signInUrl);
        }

        // Check if the token has expired
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp! < currentTime) {
            return NextResponse.redirect(signInUrl);
        }

        // Token is valid and not expired
        console.log(payload);
        return NextResponse.next();
    } catch (error) {
        // If verification fails, redirect to sign-in
        return NextResponse.redirect(signInUrl);
    }
}

export const config = {
    matcher: [
        /*
          * Match all request paths except for the ones starting with:
          * - api (API routes)
          * - _next/static (static files)
          * - _next/image (image optimization files)
          * - favicon.ico (favicon file)
          */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}