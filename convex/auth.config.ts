import { AuthConfig } from "convex/server";

export default {
    providers: [
        {
            // Clerk JWT issuer domain - configured via Convex Dashboard env vars
            domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
            applicationID: "convex",
        },
    ],
} satisfies AuthConfig;
