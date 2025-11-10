# PowerSync Integration Guide

This document explains how PowerSync has been integrated into the job booking app for local-first capability with PlanetScale PostgreSQL.

## Overview

PowerSync provides:
- **Local-first data storage**: SQLite database on device for instant access
- **Automatic synchronization**: Syncs with PlanetScale PostgreSQL when online
- **Offline capability**: App works fully offline with data queued for sync
- **Real-time updates**: Changes sync automatically across devices

## Architecture

### Files Added/Modified

1. **`lib/powersync.ts`** - Core PowerSync setup and configuration
2. **`lib/powersync-data.ts`** - Data access layer for PowerSync operations
3. **`lib/powersync-api.ts`** - API wrapper using PowerSync
4. **`lib/api.ts`** - Updated to use PowerSync API
5. **`contexts/AuthContext.tsx`** - Updated to use PowerSync for auth
6. **`contexts/BookingContext.tsx`** - Updated to use PowerSync for bookings

### Database Schema

The app uses these tables:
- **`users`** - User accounts and authentication
- **`bookings`** - Job bookings with customer info
- **`jobs`** - Individual jobs within bookings
- **`time_slots`** - Available time slots for scheduling

## Configuration

### Environment Variables

Set these in your environment or `.env` file:

```bash
POWERSYNC_URL=https://your-powersync-instance.powersync.com
POWERSYNC_TOKEN=your-jwt-token
```

### PlanetScale Setup

1. Create a PlanetScale database
2. Set up the same schema as defined in `lib/powersync.ts`
3. Configure PowerSync to sync with your PlanetScale database
4. Update the connection configuration in `lib/powersync.ts`

## Usage

### Initialization

PowerSync is automatically initialized when the app starts:

```typescript
import { getPowerSyncDatabase } from '@/lib/powersync';

const db = await getPowerSyncDatabase();
```

### Data Operations

All data operations now go through PowerSync:

```typescript
import { api } from '@/lib/api';

// Create a booking
const booking = await api.createBooking(bookingData);

// Get bookings for tenant
const bookings = await api.getBookings(tenantId);

// Update booking status
const updated = await api.updateBooking(id, { status: 'completed' });
```

### Offline Behavior

- **Reading**: Data reads from local SQLite instantly
- **Writing**: Changes are stored locally and queued for sync
- **Syncing**: When online, changes automatically sync to PlanetScale
- **Conflicts**: PowerSync handles conflict resolution automatically

## Migration from Mock API

The app has been migrated from the mock API to PowerSync:

- **Before**: Used in-memory dummy data
- **After**: Uses persistent SQLite with sync to PostgreSQL

The old `dummyApi` is still available in `lib/api.ts` for testing if needed.

## Testing

### Testing Offline Behavior

1. Disable network connection
2. Use the app - all operations should work instantly
3. Re-enable network - changes should sync automatically

### Testing Sync Behavior

1. Make changes on one device
2. Open app on another device
3. Changes should appear automatically

## Troubleshooting

### Common Issues

1. **PowerSync connection fails**
   - Check POWERSYNC_URL and POWERSYNC_TOKEN
   - Verify PowerSync instance is running

2. **Data not syncing**
   - Check network connection
   - Verify PlanetScale database is accessible
   - Check PowerSync logs

3. **Schema errors**
   - Ensure local schema matches PlanetScale schema
   - Check table names and column types

### Debug Logging

Enable debug logging by setting:

```typescript
// In lib/powersync.ts
console.log('PowerSync debug:', ...);
```

## Next Steps

1. **Set up PlanetScale database** with the required schema
2. **Configure PowerSync** with your instance URL and token
3. **Test offline functionality** to ensure everything works
4. **Monitor sync behavior** to verify data consistency

## Benefits

- **Instant performance**: No network latency for data operations
- **Reliability**: App works even with poor or no connectivity
- **Data consistency**: Automatic sync ensures all devices have latest data
- **Scalability**: PlanetScale handles the backend database scaling