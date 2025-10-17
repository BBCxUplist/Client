# Quote Messages Implementation - Client Side

## Overview

This document describes the client-side implementation of the quote messages feature, which allows artists to send structured price quotes to users within the messaging system.

## What's Been Implemented

### 1. Type Definitions (`Client/src/types/chat.ts`)

- **MessageType**: Added enum type `"regular" | "quote"`
- **QuoteData**: Complete interface for quote data structure including:
  - Event details (type, date, location, duration, guests)
  - Pricing (proposedPrice, optional breakdown)
  - Notes and validity period
  - Optional booking ID
- **Message Interface**: Updated to include `messageType` and `quoteData` fields
- **SendMessagePayload**: Extended to support quote type and quoteData

### 2. WebSocket Integration (`Client/src/hooks/useChatWebSocket.ts`)

- **sendQuote Function**: New function to send quote messages via WebSocket
  - Takes conversationId, quoteData, and optional text
  - Sends payload with type: 'quote'
  - Returns the function in the hook's return object

### 3. UI Components

#### QuoteCard (`Client/src/components/messages/QuoteCard.tsx`)

A specialized card component for displaying quote messages:

**Features:**

- Displays all event details with icons
- Shows price breakdown if provided
- Displays total price prominently
- Shows expiration status
- Includes Accept/Decline buttons for users (not shown if expired or sent by current user)
- Different styling for sent vs received quotes
- Handles optional fields gracefully
- Currency formatting for all prices
- Date formatting for event dates and validity

#### QuoteMessageModal (`Client/src/components/messages/QuoteMessageModal.tsx`)

A comprehensive modal for artists to create and send quotes:

**Features:**

- Form fields for all quote data (event type, date, location, etc.)
- Expandable price breakdown section
- Real-time character count for notes and text fields
- Client-side validation:
  - Proposed price > 0 (required)
  - Duration 1-24 hours
  - Text max 500 characters
  - Notes max 1000 characters
  - Valid until date must be in future
- Clear error messages
- Responsive grid layout
- Cancel/Send actions

### 4. Updated Components

#### MessageBubble (`Client/src/components/messages/MessageBubble.tsx`)

- Now checks `messageType` to determine rendering
- Renders QuoteCard for quote messages
- Renders regular bubble for text messages
- Maintains consistent styling and layout for both types

#### MessageInput (`Client/src/components/messages/MessageInput.tsx`)

- Added quote button (dollar sign icon) for artists
- Button only shows if `isArtist` prop is true
- Opens quote modal when clicked
- Positioned to the left of the text input
- Matches height of send button (48px)

#### ChatWindow (`Client/src/components/messages/ChatWindow.tsx`)

- Added state for quote modal (`isQuoteModalOpen`)
- Determines if current user is an artist
- Passes `isArtist` and `onOpenQuoteModal` to MessageInput
- Handles quote sending via `handleSendQuote`
- Includes QuoteMessageModal component
- Passes role information from currentUser

#### Messages.tsx (`Client/src/pages/Messages.tsx`)

- Imports QuoteData type
- Extracts sendQuote from useChatWebSocket
- Creates handleSendQuote handler
- Passes onSendQuote to ChatWindow
- Includes role in currentUser object

## User Flow

### For Artists (Sending a Quote)

1. Click the dollar sign button next to the message input
2. Fill out the quote form:
   - Required: Total Price
   - Optional: Event details, price breakdown, notes, validity date
3. Click "Send Quote"
4. Quote appears in chat as a styled card
5. Quote is sent via WebSocket to the recipient

### For Users (Receiving a Quote)

1. Quote appears in chat as a distinctive card
2. View all event details and pricing
3. See price breakdown if provided
4. Accept or Decline buttons available (if not expired)
5. Expired quotes show "EXPIRED" badge and no action buttons

## Technical Details

### Message Structure

**Quote Message:**

```typescript
{
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  messageType: "quote";
  text: string | null;  // Optional message with quote
  quoteData: {
    proposedPrice: 2500,
    eventType: "Wedding",
    eventDate: "2024-06-15T18:00:00Z",
    // ... other fields
  };
  isRead: boolean;
  createdAt: string;
  senderName: string;
  senderAvatar: string;
}
```

**WebSocket Payload:**

```typescript
{
  type: "quote",
  conversationId: string,
  text?: string,
  quoteData: {
    proposedPrice: number,
    // ... other optional fields
  }
}
```

### Validation Rules

Client-side validation (same as server requirements):

- `proposedPrice`: Required, must be > 0
- `duration`: If present, must be 1-24 hours
- `text`: Max 500 characters
- `notes`: Max 1000 characters
- `validUntil`: If present, must be in the future

### Styling Notes

- Quote cards use orange accent color (`orange-500`)
- Cards have different backgrounds for sent vs received
- Expired quotes are shown with reduced opacity
- All prices formatted as USD currency
- Responsive design with grid layouts
- Consistent with existing message UI

## Integration Points

### With Existing Code

- ✅ Uses existing WebSocket connection
- ✅ Integrates with message history API
- ✅ Uses existing React Query caching
- ✅ Follows existing component patterns
- ✅ Uses existing color scheme and styling
- ✅ Works with existing user role system

### Server-Side Requirements

According to `server-private/QUOTE_MESSAGES_GUIDE.md`, the server already supports:

- Message type enum (regular | quote)
- Quote data JSONB storage
- WebSocket quote packet handling
- Quote messages in history API

## Testing Checklist

- [ ] Send minimal quote (only proposedPrice)
- [ ] Send full quote with all fields
- [ ] Send quote with price breakdown
- [ ] Receive quote via WebSocket
- [ ] View quote in message history
- [ ] Test expired quote display
- [ ] Test quote button only shows for artists
- [ ] Test quote button hidden for users
- [ ] Test validation errors
- [ ] Test responsive layout on mobile
- [ ] Test long text in notes/message fields

## Future Enhancements

Potential additions (not currently implemented):

1. **Quote Actions:**
   - Accept quote functionality
   - Decline quote functionality
   - Counter-offer system

2. **Quote Status:**
   - Track accepted/declined status
   - Show status badges on quotes
   - Notification system for status changes

3. **Quote History:**
   - Separate view for all quotes
   - Filter by status/date
   - Export quotes

4. **Enhanced Validation:**
   - Validate event date is in future
   - Check price breakdown totals
   - Minimum/maximum price limits

## Files Modified

- ✅ `Client/src/types/chat.ts` - Type definitions
- ✅ `Client/src/hooks/useChatWebSocket.ts` - WebSocket integration
- ✅ `Client/src/components/messages/QuoteCard.tsx` - New component
- ✅ `Client/src/components/messages/QuoteMessageModal.tsx` - New component
- ✅ `Client/src/components/messages/MessageBubble.tsx` - Updated
- ✅ `Client/src/components/messages/MessageInput.tsx` - Updated
- ✅ `Client/src/components/messages/ChatWindow.tsx` - Updated
- ✅ `Client/src/pages/Messages.tsx` - Updated

## Notes

- All components follow existing code style and patterns
- Proper TypeScript typing throughout
- Accessibility attributes added where needed
- No linter errors
- Responsive design implemented
- Error handling included
- User role checking implemented
