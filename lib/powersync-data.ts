import { PowerSyncDatabase } from '@powersync/react-native';
import { User, Booking, Job, TimeSlot } from '@/types';

// PowerSync data access layer
export class PowerSyncDataService {
  private db: PowerSyncDatabase;

  constructor(db: PowerSyncDatabase) {
    this.db = db;
  }

  // User operations
  async getUserById(id: string): Promise<User | null> {
    const result = await this.db.execute('SELECT * FROM users WHERE id = ?', [id]);
    const user = result.rows?.item(0);
    return user ? this.mapRowToUser(user) : null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await this.db.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = result.rows?.item(0);
    return user ? this.mapRowToUser(user) : null;
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const id = Date.now().toString();
    
    await this.db.execute(`
      INSERT INTO users (id, email, name, tenant_id, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [id, user.email, user.name, user.tenantId, user.role, new Date().toISOString(), new Date().toISOString()]);

    return {
      id,
      ...user
    };
  }

  // Booking operations
  async getBookingsByTenantId(tenantId: string): Promise<Booking[]> {
    const result = await this.db.execute('SELECT * FROM bookings WHERE tenant_id = ? ORDER BY created_at DESC', [tenantId]);
    const bookings: Booking[] = [];
    
    if (result.rows) {
      for (let i = 0; i < result.rows.length; i++) {
        const booking = this.mapRowToBooking(result.rows.item(i));
        // Get related jobs
        booking.jobs = await this.getJobsByBookingId(booking.id);
        bookings.push(booking);
      }
    }
    
    return bookings;
  }

  async getBookingById(id: string): Promise<Booking | null> {
    const result = await this.db.execute('SELECT * FROM bookings WHERE id = ?', [id]);
    const booking = result.rows?.item(0);
    
    if (!booking) return null;
    
    const mappedBooking = this.mapRowToBooking(booking);
    // Get related jobs
    mappedBooking.jobs = await this.getJobsByBookingId(mappedBooking.id);
    
    return mappedBooking;
  }

  async createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    const id = Date.now().toString();
    const now = new Date().toISOString();
    
    await this.db.execute(`
      INSERT INTO bookings (
        id, tenant_id, customer_id, due_date, time_estimate, 
        description, quote, status, photos, custom_fields, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      booking.tenantId,
      booking.customerId,
      booking.dueDate,
      booking.timeEstimate,
      booking.description,
      booking.quote,
      booking.status,
      JSON.stringify(booking.photos || []),
      JSON.stringify(booking.customFields || {}),
      now,
      now
    ]);

    const createdBooking = await this.getBookingById(id);
    if (!createdBooking) throw new Error('Failed to create booking');
    
    return createdBooking;
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
    const now = new Date().toISOString();
    const setClause = [];
    const values = [];

    // Build dynamic update query
    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'id' || key === 'createdAt') return; // Skip these fields
      
      const dbKey = this.mapToDbColumn(key);
      if (dbKey) {
        setClause.push(`${dbKey} = ?`);
        
        if (key === 'photos' || key === 'customFields') {
          values.push(JSON.stringify(value));
        } else {
          values.push(value);
        }
      }
    });

    if (setClause.length === 0) {
      throw new Error('No valid fields to update');
    }

    setClause.push('updated_at = ?');
    values.push(now, id);

    await this.db.execute(`
      UPDATE bookings SET ${setClause.join(', ')} WHERE id = ?
    `, values);

    const updatedBooking = await this.getBookingById(id);
    if (!updatedBooking) throw new Error('Booking not found after update');
    
    return updatedBooking;
  }

  // Job operations
  async getJobsByBookingId(bookingId: string): Promise<Job[]> {
    const result = await this.db.execute('SELECT * FROM jobs WHERE booking_id = ? ORDER BY created_at', [bookingId]);
    const jobs: Job[] = [];
    
    if (result.rows) {
      for (let i = 0; i < result.rows.length; i++) {
        jobs.push(this.mapRowToJob(result.rows.item(i)));
      }
    }
    
    return jobs;
  }

  async updateJobStatus(jobId: string, status: Job['status']): Promise<Job> {
    const now = new Date().toISOString();
    
    await this.db.execute(`
      UPDATE jobs SET status = ?, updated_at = ? WHERE id = ?
    `, [status, now, jobId]);

    const result = await this.db.execute('SELECT * FROM jobs WHERE id = ?', [jobId]);
    const job = result.rows?.item(0);
    
    if (!job) throw new Error('Job not found after update');
    
    return this.mapRowToJob(job);
  }

  // Time slot operations
  async getTimeSlots(date: string): Promise<TimeSlot[]> {
    const result = await this.db.execute(`
      SELECT * FROM time_slots 
      WHERE date(start_time) = date(?) 
      ORDER BY start_time
    `, [date]);
    
    const timeSlots: TimeSlot[] = [];
    
    if (result.rows) {
      for (let i = 0; i < result.rows.length; i++) {
        timeSlots.push(this.mapRowToTimeSlot(result.rows.item(i)));
      }
    }
    
    return timeSlots;
  }

  // Helper methods for mapping database rows to TypeScript objects
  private mapRowToUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      tenantId: row.tenant_id,
      role: row.role
    };
  }

  private mapRowToBooking(row: any): Booking {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      customerId: row.customer_id,
      dueDate: row.due_date,
      timeEstimate: row.time_estimate,
      description: row.description,
      quote: row.quote,
      status: row.status,
      photos: row.photos ? JSON.parse(row.photos) : [],
      customFields: row.custom_fields ? JSON.parse(row.custom_fields) : {},
      jobs: [], // Will be populated separately
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapRowToJob(row: any): Job {
    return {
      id: row.id,
      bookingId: row.booking_id,
      status: row.status,
      photos: row.photos ? JSON.parse(row.photos) : [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapRowToTimeSlot(row: any): TimeSlot {
    return {
      id: row.id,
      startTime: row.start_time,
      endTime: row.end_time,
      available: Boolean(row.available)
    };
  }

  private mapToDbColumn(tsKey: string): string | null {
    const mapping: Record<string, string> = {
      tenantId: 'tenant_id',
      customerId: 'customer_id',
      dueDate: 'due_date',
      timeEstimate: 'time_estimate',
      customFields: 'custom_fields',
      bookingId: 'booking_id',
      startTime: 'start_time',
      endTime: 'end_time',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    };
    
    return mapping[tsKey] || tsKey;
  }
}