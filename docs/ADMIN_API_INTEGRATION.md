# Admin API Integration

## Overview

This document describes the integration of Admin APIs into the AdminDashboard and OverviewTab components. The integration replaces dummy data with real-time data fetched from the backend APIs.

## Created Hooks

All admin-related hooks are located in `Client/src/hooks/admin/`:

### 1. `useGetAllUsers.ts`

Fetches **ALL** users in the system with artist data included for users who are artists (admin only). Automatically handles pagination and fetches all pages.

**Usage:**

```typescript
const { data, isLoading, error } = useGetAllUsers();
// Returns: {
//   success,
//   message,
//   data: {
//     users: User[], // ALL users from all pages combined
//     page: 1,
//     limit: totalCount // Total number of users
//   }
// }

// User object includes:
// - All standard user fields (id, username, email, etc.)
// - isArtist: boolean flag
// - If isArtist is true, includes flattened artist data:
//   - basePrice, genres, photos, embeds, artistType
//   - isApproved, appealStatus, featured, etc.
```

**Features:**

- **Automatic pagination** - fetches all pages automatically
- Fetches 100 users per page for efficiency
- Combines all results into a single array
- Left join with artists table
- Flat JSON structure (artist data merged into user object)
- Automatic detection of artist users (`isArtist: boolean`)
- All data in single object for easy consumption
- **No need for separate artist API calls** - all artist data included

**How it works:**

1. Starts with page 1, limit 100
2. Continues fetching pages until `users.length < limit`
3. Combines all users from all pages
4. Returns complete dataset

**Artist Verification Logic:**

- **Verified Artists**: `isApproved === true`
- **Pending Artists**: `isApproved === false` or `isApproved` is null/undefined
- `appealStatus` field tracks approval workflow status

### 2. `useGetAllReports.ts`

Fetches all reports with filtering and pagination.

**Usage:**

```typescript
const { data } = useGetAllReports({
  status: 'pending',
  priority: 'high',
  limit: 50,
  page: 1,
});
// Returns: { success, message, data: { items, total, page, limit } }
```

### 3. `useGetActivityLogs.ts`

Fetches activity logs with advanced filtering.

**Usage:**

```typescript
const { data } = useGetActivityLogs({
  action: 'user_banned',
  targetType: 'user',
  limit: 50,
  page: 1,
  startDate: '2023-10-01',
  endDate: '2023-10-31',
});
// Returns: { success, message, data: { activities, pagination } }
```

### 4. `useGetActivityStats.ts`

Fetches activity statistics for a time period.

**Usage:**

```typescript
const { data } = useGetActivityStats({ days: 30 });
// Returns: { success, message, data: { stats: ActivityStat[], period } }
```

### 5. `useAdminActions.ts`

Provides mutations for admin actions.

**Available Actions:**

- `useApproveUser()` - Approve a user
- `useBanUser()` - Ban a user
- `useRejectUser()` - Reject a user
- `usePromoteUser()` - Promote a user to artist/admin
- `useDemoteUser()` - Demote a user
- `useDeleteUser()` - Delete a user

**Usage:**

```typescript
const { mutate: approveUser } = useApproveUser();
approveUser(userId);

const { mutate: promoteUser } = usePromoteUser();
promoteUser({
  userId: 'user-id',
  data: { role: 'artist', artistType: 'dj' },
});
```

### 6. `useCreateArtist.ts`

Creates a new artist account (admin only).

**Usage:**

```typescript
const { mutate: createArtist } = useCreateArtist();
createArtist({
  email: 'artist@example.com',
  username: 'dj_awesome',
  displayName: 'DJ Awesome',
  bio: 'Professional DJ',
  genres: ['House', 'Techno'],
  artistType: 'dj',
  basePrice: 500,
  // ... other fields
});
```

### 7. `useResolveReport.ts`

Resolves a report (admin only).

**Usage:**

```typescript
const { mutate: resolveReport } = useResolveReport();
resolveReport(reportId);
```

### 8. `useAdminProfile.ts`

Fetches the current admin's profile.

**Usage:**

```typescript
const { data } = useAdminProfile();
// Returns: { success, message, data: { admin: AdminProfile } }
```

### 9. `useHealthCheck.ts`

Fetches comprehensive system health status including database connectivity and statistics.

**Usage:**

```typescript
const { data } = useHealthCheck();
// Returns comprehensive health data:
// {
//   status: 'OK' | 'DEGRADED' | 'ERROR',
//   message: string,
//   timestamp: string,
//   environment: string,
//   version: string,
//   uptime: number (seconds),
//   services: {
//     api: { status, responseTime },
//     database: {
//       status, responseTime, error,
//       statistics: {
//         totalUsers, totalArtists, totalBookings, totalMessages
//       }
//     }
//   }
// }
// Automatically refetches every 5 minutes
```

**Features:**

- Database connectivity check
- Response time monitoring
- Real-time statistics (users, artists, bookings, messages)
- Error reporting
- Server uptime tracking

## Updated Components

### AdminDashboard.tsx

**Changes:**

1. **Removed all dummy data:**
   - Removed `initialArtists` array (previously generated from constants)
   - Removed `dummyUsers` array
   - Removed `dummyReports` array
2. **Removed separate artist API:**
   - **Removed** `useGetAllArtists` - no longer needed
   - All artist data comes from `useGetAllUsers` via LEFT JOIN
   - Single source of truth for users and artists
3. **Simplified data fetching:**
   - Only uses `useGetAllUsers()` - includes both users and artists
   - `useHealthCheck()` - monitors system health
   - Filters artists from users using `isArtist` flag
4. **Added authentication check** - redirects non-admin users
5. **Updated `dashboardStats` calculation:**
   - Uses real API data for statistics
   - **Verified artists**: `isApproved === true` (simplified logic)
   - **Pending artists**: `isApproved === false` or not approved
   - Calculates from filtered artists in users data
6. **Created derived data for filtering:**
   - `adminArtists` - Filtered and transformed from users where `isArtist === true`
   - `allUsers` - Transformed from all users data
7. **Added loading state** while data is being fetched
8. **Integrated proper logout** functionality with toast notifications
9. **Added health status indicator** in header showing system status

**Key Features:**

- **100% Real-time data** - No dummy data remaining
- Schema-compliant enum values
- Admin-only access with automatic redirect
- Loading state with spinner
- Dynamic statistics calculation from API
- Health monitoring with visual indicator
- Proper error handling

### OverviewTab.tsx

**Changes:**

1. **Added imports for admin hooks:**
   - `useGetActivityStats`
   - `useGetAllReports`
   - `useHealthCheck`
2. **Integrated real-time data:**
   - Activity statistics (30-day period)
   - Pending reports count
   - System health status
3. **Replaced dummy sections with real data:**
   - "Top Artists by Revenue" → "Activity Overview (Last 30 Days)"
   - "Commission Overview" → "Platform Statistics"
4. **Updated System Status section:**
   - Real API health status with visual indicator
   - Environment display
   - Live artist count
   - Pending reports count
   - Last health check timestamp
5. **Enhanced Platform Statistics:**
   - Total Artists (from API)
   - Verified Artists (filtered by schema enums)
   - Pending Artists (by appeal status)
   - Active Reports (with color coding)
   - New Users (30d from activity logs)
   - Total Bookings (30d from activity logs)

**New Data Displayed:**

- **Activity Overview (Last 30 Days):**
  - New Registrations count (from activity logs)
  - Total Bookings count (from activity logs)
  - Pending Reports count (from reports API)

- **System Status:**
  - API health status (OK/Error with color indicator)
  - Environment (development/production)
  - Active artists count
  - Pending reports count
  - Last health check timestamp

- **Platform Statistics:**
  - Total Artists (real count from API)
  - Verified Artists (schema-compliant filtering)
  - Pending Artists (schema-compliant filtering)
  - Active Reports (with alert color if > 0)
  - New Users (30d)
  - Total Bookings (30d)

## API Endpoints Used

Based on `server-private/API_DOCS.md`:

1. **GET** `/api/v1/admin/users` - Get all users
2. **GET** `/api/v1/admin/reports` - Get all reports (with filtering)
3. **GET** `/api/v1/admin/activity` - Get activity logs (with filtering)
4. **GET** `/api/v1/admin/activity/stats` - Get activity statistics
5. **GET** `/api/v1/artists` - Get all artists (with pagination)
6. **GET** `/health` - System health check
7. **PATCH** `/api/v1/admin/approve/{id}` - Approve user
8. **PATCH** `/api/v1/admin/ban/{id}` - Ban user
9. **PATCH** `/api/v1/admin/reject/{id}` - Reject user
10. **PATCH** `/api/v1/admin/promote/{id}` - Promote user
11. **PATCH** `/api/v1/admin/demote/{id}` - Demote user
12. **PATCH** `/api/v1/admin/delete/{id}` - Delete user
13. **POST** `/api/v1/admin/artists` - Create artist account
14. **PATCH** `/api/v1/admin/reports/{id}/resolve` - Resolve report

## Data Flow

```
AdminDashboard Component
    ↓
Fetch Real Data:
  - useGetAllUsers() → Returns ALL users + artists (with LEFT JOIN)
    ├─ Regular users (isArtist: false)
    └─ Artist users (isArtist: true, includes artist fields)
  - useHealthCheck() → System health + DB statistics
    ↓
Filter & Transform:
  - allUsers = all users from API
  - adminArtists = filter users where isArtist === true
    ↓
Calculate Dashboard Stats:
  - totalArtists (count where isArtist === true)
  - verifiedArtists (isApproved === true)
  - pendingArtists (isApproved === false)
  - totalRevenue (sum of basePrice * 10)
  - featuredArtists (featured === true)
    ↓
Pass stats to OverviewTab
    ↓
OverviewTab fetches additional data:
  - useGetActivityStats({ days: 30 }) → Activity metrics
  - useGetAllReports({ status: 'pending' }) → Reports count
  - useHealthCheck() → System health (includes DB statistics)
    ↓
Display Real-time Metrics:
  - Activity Overview (registrations, bookings, reports)
  - System Status (API health, environment, DB stats)
  - Platform Statistics (total users/artists from health check)
  - Verified/Pending artists (calculated from users data)
```

## Benefits

1. **100% Real-time Data**: Dashboard shows actual data from the database - no dummy data
2. **Schema Compliance**: All enums match the database schema exactly
3. **Health Monitoring**: Real-time system health status with auto-refresh
4. **Better UX**: Loading states, error handling, and visual health indicators
5. **Security**: Admin-only access with automatic redirect
6. **Scalability**: React Query caching reduces API calls
7. **Maintainability**: Separate hooks for each API endpoint
8. **Type Safety**: Full TypeScript support with proper types
9. **Error Handling**: Toast notifications for success/error states
10. **Query Invalidation**: Automatic data refresh after mutations
11. **Clean Architecture**: No remnants of dummy data or test constants

## Future Enhancements

1. **Pagination**: Add pagination support to artist and user lists
2. **Real-time Updates**: Implement WebSocket for live data updates
3. **Advanced Filters**: Add more filtering options for reports and activity
4. **Data Export**: Add ability to export data as CSV/PDF
5. **Analytics Charts**: Add visual charts for activity statistics
6. **Batch Actions**: Support bulk approve/ban/delete operations
7. **Audit Trail**: Show complete history of admin actions
8. **Role-based Permissions**: Implement granular permission system

## Testing Checklist

### Data Integrity

- [ ] No dummy data is displayed anywhere
- [ ] All artist statuses use correct schema enums (pending, approved, rejected)
- [ ] Verified artists count matches: appealStatus === 'approved' AND isApproved === true
- [ ] Pending artists count matches: appealStatus === 'pending'
- [ ] Statistics calculate correctly from real API data

### Health Monitoring

- [ ] Health check displays correct status (OK/Error)
- [ ] Health indicator shows green for OK, red for errors
- [ ] Environment displays correctly (development/production)
- [ ] Health check timestamp updates every 5 minutes
- [ ] System status section reflects real API health

### User Experience

- [ ] Admin can view dashboard with real data
- [ ] Non-admin users are redirected automatically
- [ ] Loading states display correctly with spinner
- [ ] Activity statistics show correct counts (30-day period)
- [ ] Reports data fetches correctly with filtering
- [ ] Toast notifications appear for success/error
- [ ] Logout functionality works correctly
- [ ] Error handling displays appropriate messages

### Data Display

- [ ] Total artists count is accurate
- [ ] Verified artists count is accurate
- [ ] Pending artists count is accurate
- [ ] Featured artists count is accurate
- [ ] Revenue calculation works (basePrice \* 10)
- [ ] New registrations (30d) displays correctly
- [ ] Total bookings (30d) displays correctly
- [ ] Pending reports count is accurate and color-coded

### Admin Actions (Future Implementation)

- [ ] Admin actions (approve, ban, etc.) work properly
- [ ] Data refreshes after mutations
- [ ] Artist creation uses useCreateArtist hook

## Implementation Details

### Removed Dummy Data

All dummy/mock data has been completely removed:

- ❌ `initialArtists` array (was generated from constants/artists.ts)
- ❌ `dummyUsers` array (hardcoded user data)
- ❌ `dummyReports` array (hardcoded report data)
- ✅ All data now comes from API endpoints

### Schema-Compliant Enums

All enums now match `server-private/server/db/schema.ts`:

**Appeal Status:**

```typescript
enum AppealStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}
```

**Old (Removed):**

```typescript
// These are no longer used:
enum ArtistStatus {
  VERIFIED = 'verified',
  APPEAL = 'appeal',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
}
```

### Health Check Configuration

- **Stale Time**: 1 minute (data considered fresh for 1 minute)
- **Refetch Interval**: 5 minutes (automatic background refetch)
- **Retry**: 3 attempts on failure
- **URL**: `/health` endpoint

### React Query Configuration

- **Most Queries**: 5-minute stale time
- **Activity Stats**: 2-minute stale time (fresher data)
- **Health Check**: 1-minute stale time + 5-minute auto-refetch
- All mutations automatically invalidate relevant queries
- Toast notifications use `react-hot-toast` library
- Error messages are user-friendly and informative

### Data Transformation

Artists and users from API are transformed for display:

```typescript
// Artists transformation
const adminArtists = useMemo(() => {
  const apiArtists = artistsApiData?.data?.artists || [];
  return apiArtists.map((artist: any) => ({
    id: artist.id,
    name: artist.displayName || artist.username,
    email: artist.email,
    status: artist.appealStatus, // Uses schema enum
    // ... other fields
  }));
}, [artistsApiData]);

// Users transformation
const allUsers = useMemo(() => {
  const apiUsers = usersData?.data?.users || [];
  return apiUsers.map((user: any) => ({
    id: user.id,
    name: user.displayName || user.username,
    email: user.useremail,
    status: user.banned ? 'banned' : user.isActive ? 'active' : 'suspended',
    // ... other fields
  }));
}, [usersData]);
```
