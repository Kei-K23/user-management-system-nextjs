import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    let cookie = request.cookies.get('nextjs');
    console.log(cookie);
    return NextResponse.next();
}

export const config = {
    matcher: ['/about/:path*', '/dashboard/:path*'],
}