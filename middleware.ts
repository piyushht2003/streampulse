import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth((req) => {
  const isLoggedIn = !!req.auth;
  const userRole = (req.auth?.user as any)?.role;
  const path = req.nextUrl.pathname;

  const isDashboardRoute = path.startsWith('/dashboard');
  const isOnboardingRoute = path === '/onboarding';
  const isLoginRoute = path === '/login';

  if (isLoggedIn) {
    // 1. Force onboarding if role is missing
    if (!userRole && !isOnboardingRoute) {
      return Response.redirect(new URL('/onboarding', req.nextUrl.origin));
    }

    // 2. Prevent accessing login page if already logged in
    if (isLoginRoute && userRole) {
      if (userRole === "streamer") return Response.redirect(new URL('/dashboard/creator', req.nextUrl.origin));
      return Response.redirect(new URL('/discover', req.nextUrl.origin));
    }

    // 3. Enforce RBAC for Streamer Dashboard
    if (isDashboardRoute && userRole !== "streamer") {
      return Response.redirect(new URL('/discover', req.nextUrl.origin)); // Viewers cannot access dashboard
    }
  } else {
    // 4. Protect authenticated routes from anonymous users
    if (isDashboardRoute || isOnboardingRoute) {
      return Response.redirect(new URL('/login', req.nextUrl.origin));
    }
  }
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
