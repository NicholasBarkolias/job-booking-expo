import { PowerSyncDatabase } from '@powersync/react-native';
import { PowerSyncBackendConnector, AbstractPowerSyncDatabase } from '@powersync/react-native';

// PowerSync configuration for PlanetScale
export const powersyncConfig = {
  database: {
    dbFilename: 'job-booking.db',
  },
  powersync: {
    // Replace with your PowerSync instance URL
    endpoint: process.env.POWERSYNC_URL || 'https://your-powersync-instance.powersync.com',
    // Replace with your PowerSync JWT token
    token: process.env.POWERSYNC_TOKEN || 'your-jwt-token',
  },
};

// PowerSync backend connector
class PowerSyncConnector implements PowerSyncBackendConnector {
  async fetchCredentials(): Promise<{ endpoint: string; token: string }> {
    return {
      endpoint: powersyncConfig.powersync.endpoint,
      token: powersyncConfig.powersync.token
    };
  }

  async uploadData(database: AbstractPowerSyncDatabase): Promise<void> {
    // Handle data upload to backend
    // This would sync local changes to PlanetScale
    console.log('Uploading data to backend...');
  }
}

// Initialize PowerSync database with basic setup
export const initializePowerSync = async (): Promise<PowerSyncDatabase> => {
  try {
    // For now, let's use a simpler approach without schema
    const db = new PowerSyncDatabase({
      database: {
        dbFilename: powersyncConfig.database.dbFilename,
      },
      schema: undefined as any, // Temporary workaround
    });

    // Connect to PowerSync with custom connector
    await db.connect(new PowerSyncConnector());
    
    // Create tables manually
    await createDatabaseTables(db);
    
    console.log('PowerSync database initialized and connected');
    return db;
  } catch (error) {
    console.error('Failed to initialize PowerSync:', error);
    throw error;
  }
};

// Create database tables manually
const createDatabaseTables = async (db: PowerSyncDatabase) => {
  const tables = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      tenant_id TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );`,
    
    // Bookings table
    `CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      customer_id TEXT NOT NULL,
      due_date TEXT NOT NULL,
      time_estimate INTEGER NOT NULL,
      description TEXT NOT NULL,
      quote REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      photos TEXT,
      custom_fields TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );`,
    
    // Jobs table
    `CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      booking_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      photos TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );`,
    
    // Time slots table
    `CREATE TABLE IF NOT EXISTS time_slots (
      id TEXT PRIMARY KEY,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      available BOOLEAN DEFAULT true,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );`
  ];

  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);',
    'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);',
    'CREATE INDEX IF NOT EXISTS idx_bookings_tenant_id ON bookings(tenant_id);',
    'CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);',
    'CREATE INDEX IF NOT EXISTS idx_bookings_due_date ON bookings(due_date);',
    'CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);',
    'CREATE INDEX IF NOT EXISTS idx_jobs_booking_id ON jobs(booking_id);',
    'CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);',
    'CREATE INDEX IF NOT EXISTS idx_time_slots_start_time ON time_slots(start_time);'
  ];

  // Execute table creation
  for (const table of tables) {
    await db.execute(table);
  }

  // Execute index creation
  for (const index of indexes) {
    await db.execute(index);
  }

  console.log('Database tables and indexes created successfully');
};

// Export singleton instance
let powerSyncDb: PowerSyncDatabase | null = null;

export const getPowerSyncDatabase = async (): Promise<PowerSyncDatabase> => {
  if (!powerSyncDb) {
    powerSyncDb = await initializePowerSync();
  }
  return powerSyncDb;
};

// Close database connection
export const closePowerSyncDatabase = async (): Promise<void> => {
  if (powerSyncDb) {
    await powerSyncDb.disconnect();
    powerSyncDb = null;
    console.log('PowerSync database connection closed');
  }
};