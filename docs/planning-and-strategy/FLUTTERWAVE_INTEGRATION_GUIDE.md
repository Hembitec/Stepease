# Flutterwave V3 Integration Guide

A comprehensive, battle-tested guide for integrating Flutterwave V3 payments into a Next.js (App Router) application. This guide covers everything from initial setup to production deployment, including **9 real-world problems we hit** and their solutions.

> [!CAUTION]
> **Flutterwave's docs and community articles are often WRONG about the actual payload structure and verification method.** This guide is based on real testing, not documentation. Every code sample has been verified to work.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Dashboard Setup](#2-dashboard-setup)
3. [Environment Variables](#3-environment-variables)
4. [Code Implementation](#4-code-implementation)
5. [Webhook Implementation (THE CRITICAL PART)](#5-webhook-implementation)
6. [Testing with Test Keys](#6-testing-with-test-keys)
7. [Going Live (Production)](#7-going-live-production)
8. [The 9 Hurdles We Hit (Common Problems)](#8-the-9-hurdles-we-hit)
9. [Security Checklist](#9-security-checklist)

---

## 1. Architecture Overview

```
┌─────────────┐     ┌──────────────────┐     ┌───────────────┐
│   Frontend   │────▶│  Server Action    │────▶│  Flutterwave   │
│  (Browser)   │     │  (creates         │     │  Checkout Page  │
│              │     │   checkout URL)   │     │                 │
└─────────────┘     └──────────────────┘     └───────┬─────────┘
       ▲                                              │
       │  redirect back                               │
       │  (?payment=success)                          │
       │                                              ▼
┌─────────────┐     ┌──────────────────┐     ┌───────────────┐
│   Dashboard  │◀───│  Webhook Handler  │◀───│  Flutterwave   │
│  (shows new  │     │  (POST /api/     │     │  Server        │
│   tier)      │     │   flutterwave/   │     │  (sends event) │
└─────────────┘     │   webhook)       │     └───────────────┘
                     └────────┬─────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │   Database        │
                     │  (update user     │
                     │   tier & status)  │
                     └──────────────────┘
```

### Key Concept: The Redirect vs. The Webhook

> [!IMPORTANT]
> The **redirect** (user coming back to your site) does NOT mean payment was successful.
> The **webhook** is the only reliable confirmation. Never trust the redirect alone.

- **Redirect**: User returns to your app after payment. You can show a "processing" message.
- **Webhook**: Flutterwave sends a server-to-server POST with payment details. This is where you update the database.

---

## 2. Dashboard Setup

### 2.1 Getting API Keys

1. Sign up at [Flutterwave](https://dashboard.flutterwave.com)
2. Go to **Settings → API Keys**
3. You'll see two sets of keys:
   - **Test keys**: Start with `FLWSECK_TEST-` and `FLWPUBK_TEST-`
   - **Live keys**: Start with `FLWSECK-` and `FLWPUBK-`
4. Copy the appropriate keys based on your environment

### 2.2 Configuring Webhooks

1. Go to **Settings → Webhooks**
2. Switch between **Live webhooks** and **Test webhooks** tabs
3. Configure:

| Field | Value |
|-------|-------|
| **URL** | `https://yourdomain.com/api/flutterwave/webhook` |
| **Secret Hash** | A long random string you generate (keep it safe!) |

4. Enable these checkboxes:
   - ✅ Receive webhook response in JSON format
   - ✅ Enable webhook retries
   - ✅ Enable webhook for failed transactions
   - ✅ Enable V3 webhooks

> [!CAUTION]
> **Test and Live webhooks are configured SEPARATELY.** If you set up Test webhooks but not Live, your production app won't receive payment notifications.

### 2.3 Generating a Webhook Secret Hash

```bash
openssl rand -hex 32
```

Put the **exact same value** in:
1. Your `.env.local` file (as `FLW_WEBHOOK_SECRET_HASH`)
2. The Flutterwave Dashboard webhook "Secret Hash" field
3. Your **database deployment** env vars if applicable (e.g., Convex dashboard)

---

## 3. Environment Variables

> [!WARNING]
> If you use a separate backend like Convex, Firebase, or Supabase, they have **their own** environment variable stores. Setting a variable in `.env.local` does NOT set it in your database deployment. You must set them separately.

### 3.1 Next.js `.env.local`

```bash
# Flutterwave API Keys
FLW_SECRET_KEY=FLWSECK_TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_FLW_PUBLIC_KEY=FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Webhook secret hash — must match your Flutterwave dashboard
FLW_WEBHOOK_SECRET_HASH=your-generated-random-hex-string

# Your app URL (used for payment redirect)
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Internal webhook secret for database mutations
CONVEX_WEBHOOK_SECRET=another-random-string-for-internal-use
```

### 3.2 Database (Convex/Supabase/Firebase) Env Vars

Set `CONVEX_WEBHOOK_SECRET` (or equivalent) in your database deployment separately. This is NOT auto-synced from `.env.local`.

> [!WARNING]
> `NEXT_PUBLIC_` prefix means the variable is exposed to the browser. Only use it for the **public key**. Never prefix your secret key with `NEXT_PUBLIC_`.

---

## 4. Code Implementation

### 4.1 Project Structure

```
lib/flutterwave/
├── index.ts        # Re-exports everything
├── config.ts       # API configuration & validation
├── auth.ts         # API authentication & request helper
├── plans.ts        # Plan definitions & pricing
├── checkout.ts     # Create checkout sessions
├── verify.ts       # Transaction verification
└── webhook.ts      # Webhook signature verification
```

### 4.2 Configuration (`config.ts`)

```typescript
export const flwConfig = {
    secretKey: process.env.FLW_SECRET_KEY || "",
    publicKey: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY || "",
    webhookSecretHash: process.env.FLW_WEBHOOK_SECRET_HASH || "",
    baseUrl: "https://api.flutterwave.com/v3",
};
```

### 4.3 API Request Helper (`auth.ts`)

```typescript
import { flwConfig } from "./config";

export async function flwRequest<T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = endpoint.startsWith("http")
        ? endpoint
        : `${flwConfig.baseUrl}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${flwConfig.secretKey}`,
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Flutterwave API error: ${error}`);
    }

    return response.json();
}
```

### 4.4 Server Action

> [!IMPORTANT]
> **Do NOT use `currentUser()` from Clerk in server actions.** It makes a backend API call that frequently fails with `ClerkAPIResponseError`. Use `auth()` for the user ID (reads JWT, fast), and pass the email from the client.

```typescript
// app/actions/payment.ts
"use server";

import { auth } from "@clerk/nextjs/server";  // NOT currentUser!
import { createCheckoutSession } from "@/lib/flutterwave";

export async function upgradeSubscription(
    tier: "starter" | "pro",
    email: string          // Pass from client, don't use currentUser()
): Promise<string> {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const checkoutUrl = await createCheckoutSession({
        planId: tier,
        customerEmail: email,
        customerId: userId,
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
    });

    return checkoutUrl;
}
```

### 4.5 Frontend Integration

```tsx
import { useUser } from "@clerk/nextjs"

const { user } = useUser()

const handleUpgrade = async (plan: "starter" | "pro") => {
    const email = user?.emailAddresses[0]?.emailAddress
    if (!email) { toast.error("No email found"); return }

    const checkoutUrl = await upgradeSubscription(plan, email)
    window.location.href = checkoutUrl
}
```

### 4.6 Handling the Success Redirect

```tsx
// dashboard/page.tsx
const hasShownToast = useRef(false)  // Prevent showing toast 6 times

useEffect(() => {
    if (searchParams.get("payment") === "success" && !hasShownToast.current) {
        hasShownToast.current = true
        toast.success("Subscription upgraded!")
        router.replace("/dashboard")  // Clean URL params
    }
}, [searchParams])
```

> [!WARNING]
> Without the `useRef` guard, `router.replace()` causes re-renders that re-trigger `useEffect`, showing the toast 6+ times. Always debounce one-time effects.

---

## 5. Webhook Implementation

**This is the most critical part.** Get this wrong and payments won't update your database.

### 5.1 The ACTUAL Payload (Not What Docs Say)

> [!CAUTION]
> **Tutorials and articles show a WRONG payload structure.** The actual Flutterwave webhook payload is completely different.

**What tutorials/articles show:**
```json
{
    "event": "charge.completed",
    "data": {
        "id": 10017759,
        "tx_ref": "sub_user_xxx_timestamp",
        "status": "successful",
        "amount": 29
    }
}
```

**What Flutterwave ACTUALLY sends:**
```json
{
    "id": 10017759,
    "txRef": "sub_user_xxx_timestamp",
    "status": "successful",
    "amount": 29,
    "charged_amount": 29,
    "currency": "USD",
    "customer": {
        "id": 3468076,
        "email": "user@example.com",
        "fullName": "John Doe"
    },
    "event.type": "CARD_TRANSACTION"
}
```

**Key differences:**
| Aspect | What docs say | What actually happens |
|--------|--------------|----------------------|
| Structure | Nested under `data` | **Flat** — all fields at top level |
| Event field | `event: "charge.completed"` | `"event.type": "CARD_TRANSACTION"` |
| Tx reference | `tx_ref` (snake_case) | `txRef` (camelCase) |
| Customer email | `data.customer.email` | `customer.email` (top level) |

### 5.2 Verification — Simple Comparison, NOT HMAC

```typescript
import { flwConfig } from "./config";

export function verifyWebhookSignature(
    verifHash: string | null
): boolean {
    if (!verifHash) return false;

    const secretHash = flwConfig.webhookSecretHash;
    if (!secretHash) return false;

    // SIMPLE comparison — NOT HMAC-SHA256!
    // Flutterwave sends your secret hash directly in the header
    return verifHash === secretHash;
}
```

> [!IMPORTANT]
> **This is a SIMPLE string comparison — NOT HMAC-SHA256.** The dev.to article by Flutterwave Engineering shows HMAC, but the official API actually sends your secret hash directly in the `verif-hash` header. Using HMAC will cause **silent** verification failures.

### 5.3 Webhook Route Handler

```typescript
export async function POST(req: NextRequest) {
    const rawBody = await req.text();

    // 1. Verify via verif-hash (simple comparison)
    const verifHash = req.headers.get("verif-hash");
    if (!verifyWebhookSignature(verifHash)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse flat payload
    const payload = JSON.parse(rawBody);
    const txnId = payload.id;
    const txRef = payload.txRef || payload.tx_ref || "";
    const status = payload.status;

    // 3. Only process successful transactions
    if (status !== "successful") {
        return NextResponse.json({ status: "ignored" });
    }

    // 4. Re-verify with Flutterwave API
    const verification = await verifyTransaction(txnId);
    if (verification.data.status !== "successful") {
        return NextResponse.json({ error: "Not successful" }, { status: 400 });
    }

    // 5. Extract user ID from tx_ref
    // Format: sub_user_xxxxx_timestamp → "user_xxxxx"
    const verifiedTxRef = verification.data.tx_ref || txRef;
    const parts = verifiedTxRef.split("_");
    const userId = parts.slice(1, -1).join("_"); // Handles IDs with underscores

    // 6. Update database
    // logic handling usage reset is best done inside the mutation
    await fetchMutation(api.users.updateSubscription, {
        clerkId: userId,
        tier: "starter", 
        status: "active",
        // usageResetAt is handled by the mutation
    });

    return NextResponse.json({ status: "ok" });
}
```

### 5.4 Critical: Make the Webhook Route Public

If you use any authentication middleware (Clerk, Auth.js, etc.), you MUST exclude the webhook route:

```typescript
// middleware.ts (Clerk example)
const isPublicRoute = createRouteMatcher([
    '/',
    '/api/flutterwave/webhook',  // ← THIS IS CRITICAL
]);

export default clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
        await auth.protect();
    }
});
```

> [!CAUTION]
> **If you forget this, your webhook will SILENTLY fail.** The auth middleware returns a redirect/401 before your handler runs. You won't see ANY logs. This is the #1 most common mistake.

### 5.5 App Router: No `bodyParser` Config Needed

In Next.js App Router, `export const config = { api: { bodyParser: false } }` does nothing. `req.text()` already gives you the raw body. Don't add it — it's a Pages Router convention.

---

## 6. Testing with Test Keys

### 6.1 Test Card Numbers

| Card Number | CVV | Expiry | PIN | OTP | Result |
|------------|-----|--------|-----|-----|--------|
| `5531 8866 5214 2950` | `564` | Any future date | `3310` | `12345` | ✅ Success |
| `5438 8980 1456 0229` | `883` | Any future date | `3310` | `12345` | ✅ Success |
| `4187 4274 1556 4246` | Any 3 digits | Any future date | `3310` | `12345` | ✅ Success (Visa) |
| `5143 0100 0000 0002` | Any | Any | Any | Any | ❌ Insufficient Funds |
| `5143 0100 0000 0003` | Any | Any | Any | Any | ❌ Card Declined |

### 6.2 Testing Webhooks Locally

Since Flutterwave can't reach `localhost`, you need a tunnel:

```bash
# Option A: Cloudflare Tunnel
cloudflared tunnel --url http://localhost:3000

# Option B: ngrok
ngrok http 3000
```

Then set your Flutterwave **Test webhook** URL to: `<tunnel-url>/api/flutterwave/webhook`

### 6.3 Expected Terminal Output (Working Flow)

```
[Webhook] Request received. verif-hash: present
[Webhook] Signature verified ✓
[Webhook] Event: CARD_TRANSACTION
[Webhook] Transaction: { txnId: 10017828, txRef: "sub_user_xxx_...", status: "successful", amount: 29 }
[Webhook] Re-verifying transaction: 10017828
[Webhook] Updating subscription: { clerkId: "user_xxx", tier: "starter", amount: 29 }
[Webhook] ✅ Subscription updated successfully: { clerkId: "user_xxx", tier: "starter" }
```

### 6.4 Test Mode Quirks

- **Double emails**: Flutterwave test mode sometimes sends duplicate webhook notifications. Your handler should be idempotent.
- **Masked emails**: Test mode uses masked emails like `ravesb_xxx_youremail@gmail.com`
- **Flaky webhooks**: Test mode webhooks can be unreliable. If you don't receive one, try the dashboard "Send test webhook" button.

---

## 7. Going Live (Production)

### 7.1 Checklist

- [ ] Replace test API keys with live keys in production env vars
- [ ] Configure **Live webhooks** (separate tab in Flutterwave dashboard!)
- [ ] Update webhook URL to production domain
- [ ] Set the same secret hash in Live webhook settings
- [ ] Enable all webhook checkboxes (JSON, retries, failed, V3)
- [ ] Set `CONVEX_WEBHOOK_SECRET` in your database deployment (Convex/Supabase/etc.)
- [ ] Deploy latest code
- [ ] Test with a real small payment
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)

### 7.2 Code Changes Required

**None.** The code reads from environment variables, so swapping test keys for live keys is all you need.

### 7.3 Key Differences

| Aspect | Test Mode | Live Mode |
|--------|-----------|-----------|
| Keys prefix | `FLWSECK_TEST-` | `FLWSECK-` |
| Real money | No | Yes |
| Webhooks | Sometimes flaky | Reliable |
| Dashboard tab | "Test webhooks" | "Live webhooks" |
| Test cards | Work | Don't work (real cards only) |
| Emails | Masked/mock | Real |

---

## 8. The 9 Hurdles We Hit

These are real problems encountered during integration, in the order we discovered them.

### Hurdle 1: Missing Library Files

**Symptom:** `Module not found: Can't resolve './auth'`

**Cause:** Accidentally rejected code changes during setup, leaving the `lib/flutterwave/` directory incomplete.

**Fix:** Ensure all 7 files exist: `index.ts`, `config.ts`, `auth.ts`, `plans.ts`, `checkout.ts`, `verify.ts`, `webhook.ts`

---

### Hurdle 2: Auth Middleware Blocking Webhooks (SILENT FAILURE)

**Symptom:** Zero webhook logs. No errors. Nothing. Tier just doesn't update.

**Cause:** Clerk/Auth.js middleware intercepted the webhook POST. Since Flutterwave sends no user session, the middleware returned a redirect/401 before the handler ever ran.

**Fix:** Add `/api/flutterwave/webhook` to your public routes list.

**Why it's insidious:** There are NO server-side logs. The request is killed at the middleware layer. You'd only find this by checking Flutterwave's webhook logs (which show the redirect response).

---

### Hurdle 3: Wrong Webhook Header Name

**Symptom:** `[Webhook] Signature verification failed`

**Cause:** We checked for `flutterwave-signature` header. Flutterwave actually sends `verif-hash`.

**Fix:** `req.headers.get("verif-hash")`

---

### Hurdle 4: Wrong Verification Method (HMAC vs Simple)

**Symptom:** `[Webhook] Signature verification failed` even with correct secret

**Cause:** The dev.to article (by Flutterwave's own engineering team!) showed HMAC-SHA256 verification. The actual API just sends your secret hash directly in the header.

**Fix:** Simple string comparison: `verifHash === secretHash`

**Lesson:** Official documentation ≠ actual behavior. Always test.

---

### Hurdle 5: Wrong Payload Structure (THE BIG ONE)

**Symptom:** `Cannot read properties of undefined (reading 'status')`

**Cause:** Every tutorial shows `{ event: "charge.completed", data: { ... } }`. The actual payload is flat: `{ id, txRef, status, "event.type": "CARD_TRANSACTION" }`.

**Fix:** Parse the flat structure directly instead of accessing `payload.data.status`.

**Lesson:** Log the raw payload during development. Don't trust documentation.

---

### Hurdle 6: Clerk `currentUser()` Failing in Server Actions

**Symptom:** `ClerkAPIResponseError: api_response_error`

**Cause:** `currentUser()` makes a backend API call to Clerk that can fail. `auth()` works fine because it just reads the JWT token.

**Fix:** Don't use `currentUser()`. Pass the email from the client via `useUser()` hook.

---

### Hurdle 7: Database Webhook Secret Not Set

**Symptom:** `Unauthorized: Invalid webhook secret` from Convex

**Cause:** `CONVEX_WEBHOOK_SECRET` was set in `.env.local` (Next.js) but NOT in the Convex deployment. These are **completely separate** environment variable stores.

**Fix:** Set `CONVEX_WEBHOOK_SECRET` in the Convex dashboard (or via CLI).

**Lesson:** `.env.local` ≠ your database's env vars. They don't sync.

---

### Hurdle 8: Success Toast Showing 6 Times

**Symptom:** "Subscription upgraded!" toast appears 6 times.

**Cause:** `router.replace("/dashboard")` causes re-renders → `useEffect` re-triggers → toast fires again → loop.

**Fix:** Use `useRef(false)` to ensure the toast only fires once.

---

### Hurdle 9: tx_ref Parsing Bug with Underscore IDs

**Symptom:** User not found after webhook processes.

**Cause:** Clerk IDs contain underscores (`user_39D0LPiL3x`). `split("_")[1]` returns just `"user"` instead of the full ID.

```
tx_ref = "sub_user_39D0LPiL3x_1770977213812"

split("_")[1] → "user"           // WRONG — incomplete!
slice(1, -1).join("_") → "user_39D0LPiL3x"  // RIGHT ✓
```

**Fix:** `parts.slice(1, -1).join("_")`

---

## 9. Security Checklist

- [ ] Webhook verified via `verif-hash` header (simple string comparison)
- [ ] Secret key never exposed to frontend (no `NEXT_PUBLIC_` prefix)
- [ ] Webhook route is public (bypasses auth middleware) but verifies its own signature
- [ ] Transactions re-verified via Flutterwave API before updating database
- [ ] `tx_ref` validated and parsed carefully (handles underscore IDs)
- [ ] Error responses don't leak internal details
- [ ] HTTPS used for webhook endpoint
- [ ] Environment variables set in ALL deployment targets (Next.js, database, etc.)

---

## Quick Reference

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/v3/payments` | POST | Create checkout session |
| `/v3/transactions/:id/verify` | GET | Re-verify transaction |
| `/v3/subscriptions?email=x` | GET | List subscriptions |
| `/v3/subscriptions/:id/cancel` | PUT | Cancel subscription |

### Webhook Payload (Actual)

| Field | Type | Example |
|-------|------|---------|
| `id` | number | `10017759` |
| `txRef` | string | `"sub_user_xxx_timestamp"` |
| `status` | string | `"successful"` |
| `amount` | number | `29` |
| `customer.id` | number | `3468076` |
| `customer.email` | string | `"user@example.com"` |
| `"event.type"` | string | `"CARD_TRANSACTION"` |

### Header Reference

| Header | Direction | Contains |
|--------|-----------|----------|
| `verif-hash` | Flutterwave → You | Your secret hash (for verification) |
| `Authorization: Bearer xxx` | You → Flutterwave | Your secret key (for API calls) |

---

*Last updated: February 14, 2026*
*Battle-tested with Flutterwave V3 API in production*
