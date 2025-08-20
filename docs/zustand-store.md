# Zustand Store Documentation

## Overview

The UPlist application uses Zustand for state management with a single store that contains all application data and actions. The store is persisted to sessionStorage for demo purposes.

## Store Structure

### State Interface

```typescript
interface AppState {
  // Auth slice
  auth: {
    currentUserId?: string;
    role?: Role;
  };
  
  // Data slices
  users: User[];
  artists: Artist[];
  bookings: Booking[];
  appeals: Appeal[];
  reports: Report[];
  
  // Actions (see below)
}
```

### Data Types

#### User
```typescript
interface User {
  id: string;
  name: string;
  avatar?: string;
  description?: string;
  socials?: Socials;
  role: Role;
  banned?: boolean;
  createdAt: string;
}
```

#### Artist
```typescript
interface Artist {
  id: string;
  slug: string;
  name: string;
  avatar?: string;
  bio?: string;
  socials?: Socials;
  embeds?: Embeds;
  photos: string[];
  price: number;
  rating: number;
  tags: string[];
  availability: string[];
  isBookable: boolean;
  appealStatus: AppealStatus;
  featured?: boolean;
  createdAt: string;
}
```

#### Booking
```typescript
interface Booking {
  id: string;
  artistId: string;
  userId: string;
  status: BookingStatus;
  date: string;
  amount: number;
  escrowStatus: EscrowStatus;
  threadId?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Actions

### Authentication Actions

#### login(role: Role, userId: string)
Sets the current user and role in the auth slice.

```typescript
const { login } = useAppStore();
login('user', 'user-1');
```

#### logout()
Clears the auth slice.

```typescript
const { logout } = useAppStore();
logout();
```

### Registration Actions

#### registerUser(userData: Partial<User>): string
Creates a new user and returns the user ID.

```typescript
const { registerUser } = useAppStore();
const userId = registerUser({
  name: 'John Doe',
  description: 'Music enthusiast',
});
```

#### registerArtist(artistData: Partial<Artist>): string
Creates a new artist and returns the artist ID.

```typescript
const { registerArtist } = useAppStore();
const artistId = registerArtist({
  name: 'Jane Smith',
  slug: 'jane-smith',
  bio: 'Professional musician',
  price: 500,
});
```

### Booking Actions

#### createBooking(artistId: string, userId: string, date: string, amount: number): string
Creates a new booking and returns the booking ID.

```typescript
const { createBooking } = useAppStore();
const bookingId = createBooking('artist-1', 'user-1', '2024-12-25', 500);
```

#### setBookingStatus(id: string, status: BookingStatus)
Updates the status of a booking.

```typescript
const { setBookingStatus } = useAppStore();
setBookingStatus('booking-1', 'accepted');
```

#### fundEscrow(bookingId: string, amount: number)
Funds the escrow for a booking.

```typescript
const { fundEscrow } = useAppStore();
fundEscrow('booking-1', 500);
```

#### releaseEscrow(bookingId: string)
Releases escrow funds to the artist.

```typescript
const { releaseEscrow } = useAppStore();
releaseEscrow('booking-1');
```

#### refundEscrow(bookingId: string)
Refunds escrow funds to the user.

```typescript
const { refundEscrow } = useAppStore();
refundEscrow('booking-1');
```

#### createThread(bookingId: string): string
Creates a chat thread for a booking and returns the thread ID.

```typescript
const { createThread } = useAppStore();
const threadId = createThread('booking-1');
```

### Appeal Actions

#### submitAppeal(artistId: string, message: string, portfolioLinks?: string[]): string
Submits an appeal for an artist and returns the appeal ID.

```typescript
const { submitAppeal } = useAppStore();
const appealId = submitAppeal('artist-1', 'I am a professional musician...', [
  'https://youtube.com/@artist',
  'https://spotify.com/artist/123'
]);
```

#### approveAppeal(appealId: string)
Approves an artist appeal and makes them bookable.

```typescript
const { approveAppeal } = useAppStore();
approveAppeal('appeal-1');
```

#### rejectAppeal(appealId: string)
Rejects an artist appeal.

```typescript
const { rejectAppeal } = useAppStore();
rejectAppeal('appeal-1');
```

### Report Actions

#### addReport(reportData): string
Creates a new report and returns the report ID.

```typescript
const { addReport } = useAppStore();
const reportId = addReport({
  reporterId: 'user-1',
  targetId: 'artist-1',
  targetType: 'artist',
  reason: 'inappropriate',
  details: 'The artist was unprofessional...'
});
```

#### closeReport(reportId: string)
Closes a report.

```typescript
const { closeReport } = useAppStore();
closeReport('report-1');
```

### Admin Actions

#### toggleBan(id: string, type: 'user' | 'artist')
Toggles the ban status of a user or artist.

```typescript
const { toggleBan } = useAppStore();
toggleBan('user-1', 'user');
toggleBan('artist-1', 'artist');
```

## Custom Hooks

### useAuth()
Returns authentication state and actions.

```typescript
const { currentUserId, role, isAuthenticated, login, logout } = useAuth();
```

### useCurrentUser()
Returns the current user object.

```typescript
const currentUser = useCurrentUser();
```

### useArtists()
Returns all artists with various filtering options.

```typescript
const artists = useArtists();
const artist = useArtistBySlug('artist-slug');
const featuredArtists = useFeaturedArtists();
```

### useBookings()
Returns bookings with various filtering options.

```typescript
const userBookings = useBookingsByUser('user-1');
const currentBookings = useCurrentBookings('user-1');
const artistRequests = useArtistRequests('artist-1');
```

### useAppeals()
Returns appeals with various filtering options.

```typescript
const pendingAppeals = usePendingAppeals();
const artistAppeals = useAppealsByArtist('artist-1');
```

### useReports()
Returns reports with various filtering options.

```typescript
const openReports = useOpenReports();
const userReports = useReportsByReporter('user-1');
```

## Persistence

The store is configured to persist the following data to sessionStorage:

- auth
- users
- artists
- bookings
- appeals
- reports

This ensures that data persists across page refreshes during the demo session.

## Example Usage

```typescript
import { useAppStore } from '@/store';
import { useAuth, useCurrentUser } from '@/hooks/useAuth';

function MyComponent() {
  const { isAuthenticated, currentUserId } = useAuth();
  const currentUser = useCurrentUser();
  const { createBooking, fundEscrow } = useAppStore();

  const handleBookArtist = async (artistId: string, date: string, amount: number) => {
    const bookingId = createBooking(artistId, currentUserId!, date, amount);
    fundEscrow(bookingId, amount);
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {currentUser?.name}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```
