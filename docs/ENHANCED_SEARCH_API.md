# Enhanced Search API Implementation

## Overview

The search API has been significantly enhanced to provide better location and genre filtering capabilities, along with improved validation, sanitization, and error handling.

## API Endpoint

```
GET /api/v1/artists/search
```

## Parameters

### Required Parameters

- `q` (string, required): Search query string
  - Minimum length: 2 characters
  - Maximum length: 100 characters
  - Automatically sanitized to prevent injection attacks

### Optional Parameters

- `location` (string, optional): Location filter
  - Minimum length: 4 characters
  - Supports partial matching
  - Examples: "Berlin", "New York", "London, UK"

- `genre` (string[], optional): Genre filters
  - Can specify multiple genres
  - Supports partial matching
  - Examples: "Electronic", "Techno", "House"

- `minPrice` (number, optional): Minimum price filter
  - Must be non-negative
  - Example: 500

- `maxPrice` (number, optional): Maximum price filter
  - Must be non-negative
  - Must be greater than or equal to minPrice
  - Example: 2000

- `isBookable` (boolean, optional): Filter for bookable artists only
  - Example: true

- `isAvailable` (boolean, optional): Filter for available artists only
  - Example: true

- `sortBy` (string, optional): Sort field
  - Options: "name", "price", "createdAt", "rating"
  - Default: "name"

- `sortOrder` (string, optional): Sort order
  - Options: "asc", "desc"
  - Default: "asc"

- `page` (number, optional): Page number
  - Default: 1
  - Minimum: 1

- `limit` (number, optional): Results per page
  - Default: 12
  - Minimum: 1
  - Maximum: 100

## Example Requests

### Basic Search

```
GET /api/v1/artists/search?q=electronic
```

### Search with Location Filter

```
GET /api/v1/artists/search?q=electronic&location=Berlin
```

### Search with Genre Filter

```
GET /api/v1/artists/search?q=electronic&genre=Techno&genre=House
```

### Advanced Search

```
GET /api/v1/artists/search?q=electronic&location=Berlin&genre=Techno&minPrice=500&maxPrice=2000&isBookable=true&sortBy=price&sortOrder=asc&page=1&limit=10
```

## Response Format

```json
{
  "success": true,
  "message": "Artists search results",
  "data": {
    "artists": [
      {
        "id": "uuid",
        "role": "artist",
        "username": "electronic_artist",
        "email": "artist@example.com",
        "displayName": "Electronic Artist",
        "avatar": "https://example.com/avatar.jpg",
        "bio": "Electronic music producer",
        "phone": "+1234567890",
        "location": "Berlin, Germany",
        "socials": {
          "soundcloud": "https://soundcloud.com/electronic_artist"
        },
        "isActive": true,
        "isAdmin": false,
        "isLinkpageVisible": true,
        "banned": false,
        "genres": ["Electronic", "Techno"],
        "photos": ["https://example.com/photo1.jpg"],
        "embeds": [
          {
            "soundcloud": ["https://soundcloud.com/track/track1"],
            "custom": [
              { "title": "DJCity Feature", "url": "https://djcity.com/feature" }
            ]
          }
        ],
        "artistType": "dj",
        "basePrice": 800,
        "featured": true,
        "isActiveArtist": true,
        "isApproved": true,
        "isAvailable": true,
        "isBookable": true,
        "appealStatus": null,
        "privacyOptions": {
          "profileVisibility": true,
          "showContactInfo": true,
          "allowDirectMessages": true
        },
        "playlists": [],
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "page": 1,
    "limit": 10,
    "hasMore": false
  }
}
```

## Frontend Implementation

### Basic Search Hook

```typescript
import { useSearchArtists } from '@/hooks/generic/useSearchArtists';

const { data, isLoading, error } = useSearchArtists({
  query: 'electronic',
  location: 'Berlin',
  genres: ['Techno', 'House'],
  page: 1,
  limit: 12,
});
```

### Advanced Search Hook

```typescript
import { useAdvancedSearchArtists } from '@/hooks/generic/useAdvancedSearchArtists';

const { data, isLoading, error } = useAdvancedSearchArtists({
  query: 'electronic',
  location: 'Berlin',
  genres: ['Techno', 'House'],
  minPrice: 500,
  maxPrice: 2000,
  isBookable: true,
  isAvailable: true,
  sortBy: 'price',
  sortOrder: 'asc',
  page: 1,
  limit: 12,
});
```

### Search Utilities

```typescript
import {
  buildSearchQuery,
  validateSearchParams,
  sanitizeSearchQuery,
  createSearchCacheKey,
} from '@/lib/searchUtils';

// Build search query
const params = buildSearchQuery({
  query: 'electronic',
  location: 'Berlin',
  genres: ['Techno'],
});

// Validate search parameters
const errors = validateSearchParams({
  query: 'electronic',
  location: 'Berlin',
  genres: ['Techno'],
});

// Sanitize search query
const sanitized = sanitizeSearchQuery(
  'electronic <script>alert("xss")</script>'
);

// Create cache key
const cacheKey = createSearchCacheKey('search-artists', filters, 1, 12);
```

## Validation Rules

### Query Validation

- Required field
- Minimum length: 2 characters
- Maximum length: 100 characters
- Automatically sanitized

### Location Validation

- Optional field
- Minimum length: 4 characters (if provided)
- Supports partial matching

### Genre Validation

- Optional field
- Array of strings
- Each genre is trimmed and validated

### Price Validation

- Optional fields
- Must be non-negative
- minPrice cannot be greater than maxPrice

### Pagination Validation

- Page must be >= 1
- Limit must be between 1 and 100

## Error Handling

The API returns appropriate error messages for validation failures:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Search query is required",
    "Location filter must be at least 4 characters long",
    "Minimum price cannot be greater than maximum price"
  ]
}
```

## Caching Strategy

- Search results are cached for 2 minutes
- Cache keys include all search parameters
- Automatic cache invalidation on parameter changes
- Prefetching for next page results

## Security Features

- Input sanitization to prevent XSS attacks
- Query parameter validation
- Rate limiting (handled by backend)
- SQL injection prevention (handled by backend)

## Performance Optimizations

- Debounced search input (500ms delay)
- Query result caching
- Prefetching of next page
- Optimized database queries (handled by backend)
- Pagination to limit result sets

## Usage Examples

### Simple Search

```typescript
const { data } = useSearchArtists({
  query: 'electronic music',
});
```

### Location-Based Search

```typescript
const { data } = useSearchArtists({
  query: 'dj',
  location: 'New York',
});
```

### Genre-Filtered Search

```typescript
const { data } = useSearchArtists({
  query: 'music',
  genres: ['Electronic', 'Techno', 'House'],
});
```

### Price-Range Search

```typescript
const { data } = useAdvancedSearchArtists({
  query: 'artist',
  minPrice: 500,
  maxPrice: 2000,
  isBookable: true,
});
```

### Complex Search

```typescript
const { data } = useAdvancedSearchArtists({
  query: 'electronic',
  location: 'Berlin',
  genres: ['Techno', 'Minimal'],
  minPrice: 800,
  maxPrice: 1500,
  isBookable: true,
  isAvailable: true,
  sortBy: 'price',
  sortOrder: 'asc',
  page: 1,
  limit: 20,
});
```

## Migration Guide

### From Old Search API

1. Update search hook calls to include new parameters:

   ```typescript
   // Old
   useSearchArtists({ query: 'electronic' });

   // New
   useSearchArtists({
     query: 'electronic',
     location: 'Berlin',
     genres: ['Techno'],
   });
   ```

2. Add validation for search parameters:

   ```typescript
   const errors = validateSearchParams(filters);
   if (errors.length > 0) {
     // Handle validation errors
   }
   ```

3. Use new search utilities for complex queries:
   ```typescript
   const params = buildSearchQuery(filters);
   ```

## Testing

### Unit Tests

- Parameter validation
- Query building
- Sanitization functions
- Cache key generation

### Integration Tests

- API endpoint testing
- Error handling
- Response format validation

### Performance Tests

- Search response times
- Cache effectiveness
- Memory usage

## Future Enhancements

- Full-text search with Elasticsearch
- Fuzzy matching for typos
- Search suggestions/autocomplete
- Search analytics and metrics
- Advanced filtering options
- Search result ranking algorithms
