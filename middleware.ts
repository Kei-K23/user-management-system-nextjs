import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/sign-in', '/sign-up', '/forgot-password'];

export function middleware(request: NextRequest) {
    // TODO: change with actual auth cookie name
    let cookie = request.cookies.get('nextjs');
    const signInUrl = new URL('/sign-in', request.url)
    const pathname = request.nextUrl.pathname;
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    // If the pathname is public then pass the authentication
    if (isPublicRoute) {
        return NextResponse.next();
    }

    // Check if the pathname is not public and not auth cookie exists, then redirect to sign in page
    if (!cookie) {
        return NextResponse.redirect(signInUrl);
    }
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}