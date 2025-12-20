# Payment Pages Guide

This guide explains the payment pages that have been created and how to test them.

## Pages Created

1. **Payment Success** (`/payment/success`) - Shows successful payment completion
2. **Payment Cancel** (`/payment/cancel`) - Shows when payment is cancelled
3. **Payment Expire** (`/payment/expire`) - Shows when payment session expires
4. **Payment Failed** (`/payment/failed`) - Shows when payment fails

## Features

All pages include:

- ✅ Consistent dark theme matching your app design
- ✅ Back button (navigates to `/`)
- ✅ Home button (navigates to `/`)
- ✅ Booking ID display (if available in URL params)
- ✅ Appropriate icons and messaging for each scenario

## How to Test Each Page

### 1. Payment Success Page

**URL:** `http://localhost:5173/payment/success?booking_id=YOUR_BOOKING_ID`

**How to trigger:**

- After successful Stripe payment, your backend should redirect to this URL
- The backend should append `?booking_id=xxx` to the success URL

**What it shows:**

- Success message
- Complete payment information
- Booking details (event type, date, location, etc.)
- Contact information
- Payment status

**Manual Testing:**

```
http://localhost:5173/payment/success?booking_id=814cc85c-8fe6-4607-b515-a014b676b311
```

### 2. Payment Cancel Page

**URL:** `http://localhost:5173/payment/cancel?booking_id=YOUR_BOOKING_ID`

**How to trigger:**

- When user clicks "Cancel" on Stripe checkout page
- Your backend should redirect to this URL when payment is cancelled

**What it shows:**

- Cancellation message
- Information that no charges were made
- Booking ID (if available)

**Manual Testing:**

```
http://localhost:5173/payment/cancel?booking_id=814cc85c-8fe6-4607-b515-a014b676b311
```

### 3. Payment Expire Page

**URL:** `http://localhost:5173/payment/expire?booking_id=YOUR_BOOKING_ID`

**How to trigger:**

- When Stripe checkout session expires (typically after 24 hours)
- Your backend should redirect to this URL when session expires

**What it shows:**

- Expiration message
- Explanation of why it happened
- Information that booking is still available

**Manual Testing:**

```
http://localhost:5173/payment/expire?booking_id=814cc85c-8fe6-4607-b515-a014b676b311
```

### 4. Payment Failed Page

**URL:** `http://localhost:5173/payment/failed?booking_id=YOUR_BOOKING_ID&error=ERROR_MESSAGE`

**How to trigger:**

- When payment processing fails (insufficient funds, card declined, etc.)
- Your backend should redirect to this URL with error details

**What it shows:**

- Failure message
- Error details (if provided in URL)
- Troubleshooting tips
- Booking ID (if available)

**Manual Testing:**

```
http://localhost:5173/payment/failed?booking_id=814cc85c-8fe6-4607-b515-a014b676b311&error=Card%20declined
```

## Backend Configuration

Your backend needs to configure Stripe checkout sessions with these redirect URLs:

```javascript
// Example Stripe Checkout Session Configuration
const session = await stripe.checkout.sessions.create({
  // ... other config
  success_url: `${process.env.APP_URL}/payment/success?booking_id={BOOKING_ID}&session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.APP_URL}/payment/cancel?booking_id={BOOKING_ID}`,
  // Note: expire_url is handled via webhook or session status check
});
```

### Environment Variable

Make sure your backend has:

```
APP_URL=http://localhost:5173
```

## Fixing the 500 Error

The 500 error you were seeing was because:

1. The backend endpoint `GET /bookings/:id` might not exist or was returning an error
2. The hook now has a fallback mechanism that tries to get booking from the cached bookings list

**Solution:**

- The `useGetBooking` hook now:
  1. First tries to fetch from `GET /bookings/:id`
  2. If that fails, it tries to find the booking in the cached bookings list
  3. This provides a graceful fallback

**To fully fix:**

- Ensure your backend has a `GET /bookings/:id` endpoint that returns:

```json
{
  "success": true,
  "message": "Booking retrieved successfully",
  "data": {
    "id": "...",
    "userId": "...",
    "artistId": "...",
    "status": "..."
    // ... other booking fields
  }
}
```

## Testing All Pages at Once

You can test all pages by navigating directly to:

1. **Success:** `http://localhost:5173/payment/success?booking_id=814cc85c-8fe6-4607-b515-a014b676b311`
2. **Cancel:** `http://localhost:5173/payment/cancel?booking_id=814cc85c-8fe6-4607-b515-a014b676b311`
3. **Expire:** `http://localhost:5173/payment/expire?booking_id=814cc85c-8fe6-4607-b515-a014b676b311`
4. **Failed:** `http://localhost:5173/payment/failed?booking_id=814cc85c-8fe6-4607-b515-a014b676b311&error=Test%20error`

## URL Parameters

All pages accept these URL parameters:

- `booking_id` - The booking ID (primary)
- `session_id` - Stripe session ID (fallback for booking_id)
- `error` - Error message (for failed page)
- `message` - Alternative error message parameter

## Notes

- All pages will work even without booking_id (they'll show appropriate messages)
- The Payment Success page will try to fetch booking details, but gracefully handles errors
- All navigation buttons go to `/` (your default route)
- The design matches your app's dark theme with orange accents
