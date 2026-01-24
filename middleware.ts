import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Public routes - landing page and static files
const isPublicRoute = createRouteMatcher([
    '/',
    '/manifest.json',
    '/robots.txt',
    '/llms.txt',
])

export default clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
        await auth.protect()
    }
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        // Added 'json' to the list of extensions to skip (for manifest.json, etc.)
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|txt)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
