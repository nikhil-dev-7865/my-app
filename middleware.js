import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/account(.*)',
  '/transactions(.*)',
]);
export default clerkMiddleware(async (auth, req) => {
  const {userId} = await auth();
 
  if (!userId && isProtectedRoute(req)) {
    
    const {redirectToSignIn}=await auth();
    
    return redirectToSignIn();
  }
});

export const config = {
  matcher: [
    '/((?!api|trpc|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
