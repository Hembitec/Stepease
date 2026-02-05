# Webhook Testing Guide

## Environment Variables Required

Add these to your `.env.local`:

```bash
# Flutterwave OAuth 2.0 Credentials
FLW_CLIENT_ID=your_client_id
FLW_CLIENT_SECRET=your_client_secret

# Webhook Security
FLW_WEBHOOK_SECRET_HASH=your_webhook_secret_hash

# Convex Webhook Secret (generate a random string)
CONVEX_WEBHOOK_SECRET=your_random_secret_string

# Public Key (for inline checkout)
NEXT_PUBLIC_FLW_PUBLIC_KEY=your_public_key

# App URL (for redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Testing with ngrok (Local Development)

### 1. Install ngrok
```bash
# macOS
brew install ngrok

# Linux
snap install ngrok

# Or download from https://ngrok.com/download
```

### 2. Start ngrok tunnel
```bash
ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

### 3. Configure Flutterwave Webhook

1. Go to [Flutterwave Dashboard](https://dashboard.flutterwave.com/)
2. Navigate to **Settings → API** → **Webhooks**
3. Set webhook URL to: `https://abc123.ngrok.io/api/flutterwave/webhook`
4. Copy the "Secret Hash" and add it to `FLW_WEBHOOK_SECRET_HASH`

---

## Testing with cURL (Manual Test)

You can manually test the webhook endpoint:

```bash
# Generate HMAC signature
SECRET_HASH="your_webhook_secret_hash"
BODY='{"event":"charge.completed","data":{"id":123456,"tx_ref":"sub_user_clerk123_1234567890","amount":19,"status":"successful","customer":{"id":789,"email":"test@example.com"}}}'
SIGNATURE=$(echo -n "$BODY" | openssl dgst -sha256 -hmac "$SECRET_HASH" -binary | base64)

# Send webhook
curl -X POST http://localhost:3000/api/flutterwave/webhook \
  -H "Content-Type: application/json" \
  -H "flutterwave-signature: $SIGNATURE" \
  -d "$BODY"
```

---

## Flutterwave Sandbox Testing

1. **Get Test Cards** from [Flutterwave Docs](https://developer.flutterwave.com/docs/integration-guides/testing-helpers/test-cards)

2. **Common Test Card:**
   - Number: `5531886652142950`
   - CVV: `564`
   - Expiry: `09/32`
   - PIN: `3310`
   - OTP: `12345`

3. **Test Flow:**
   1. Click "Upgrade" in the app
   2. Complete payment with test card
   3. Webhook fires to your ngrok URL
   4. Check Convex dashboard for updated user tier

---

## Debugging

Check webhook logs in your terminal:
```
[Webhook] Event received: charge.completed
[Webhook] Subscription updated: { clerkId: 'user_xxx', tier: 'growth' }
```

Check Convex dashboard for user records:
- Go to [Convex Dashboard](https://dashboard.convex.dev)
- Select your project → Data → `users` table
