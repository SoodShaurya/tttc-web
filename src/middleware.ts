import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@/utils/supabase';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request)

  // Get the user's session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect to login if no session exists
  if (!session) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname); // Optional: Add redirect back functionality
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    // Protect specific routes
    '/protected/:path*', // Restrict access to routes under /protected
  ],
};
