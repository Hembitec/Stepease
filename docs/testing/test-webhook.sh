#!/bin/bash

# Test webhook script - Simulates a Flutterwave charge.completed event

# Update these values:
WEBHOOK_URL="https://ease.070351.xyz/api/flutterwave/webhook"
WEBHOOK_SECRET="your-secret-from-env"  # Replace with actual FLW_WEBHOOK_SECRET_HASH
CLERK_USER_ID="user_39D0LPiL3xmqsghcGfWmuaueqJv"  # Your actual Clerk ID
CUSTOMER_EMAIL="muse8tease@gmail.com"

# Sample payload
PAYLOAD='{
  "event": "charge.completed",
  "data": {
    "id": 12345678,
    "tx_ref": "sub_'"$CLERK_USER_ID"'_1770977213812",
    "flw_ref": "FLW-MOCK-TEST-REF",
    "amount": 29,
    "currency": "USD",
    "status": "successful",
    "payment_type": "card",
    "customer": {
      "id": 987654,
      "email": "'"$CUSTOMER_EMAIL"'",
      "name": "Test User"
    }
  }
}'

# Generate signature
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" -binary | base64)

echo "Testing webhook..."
echo "Payload: $PAYLOAD"
echo "Signature: $SIGNATURE"

# Send request
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "flutterwave-signature: $SIGNATURE" \
  -d "$PAYLOAD" \
  --verbose

echo ""
echo "Check your Convex database to see if tier updated!"
