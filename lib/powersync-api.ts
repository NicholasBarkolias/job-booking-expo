import { PowerSyncDatabase } from '@powersync/react-native';
import { PowerSyncDataService } from './powersync-data';
import { Booking, Job } from '@/types';

// Replace the existing API with PowerSync-based implementation
export const api = {
  // Auth - now uses PowerSync
  async login(email: string, _password: string) {
    console.log('API: PowerSync login called with', email);
    
    try {
      const db = await getPowerSyncDatabase();
      const dataService = new PowerSyncDataService(db);
      
      // Find user by email (in real app, would verify password)
      const user = await dataService.getUserByEmail(email);
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      console.log('API: PowerSync login successful, user:', user);
      return user;
    } catch (error) {
      console.error('API: PowerSync login failed:', error);
      throw error;
    }
  },

  async logout() {
    console.log('API: PowerSync logout called');
    // In a real app, would clear tokens and session
    // For now, just simulate
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  // Bookings - now uses PowerSync
  async getBookings(tenantId: string) {
    console.log('API: PowerSync getBookings called for tenant:', tenantId);
    
    try {
      const db = await getPowerSyncDatabase();
      const dataService = new PowerSyncDataService(db);
      
      const bookings = await dataService.getBookingsByTenantId(tenantId);
      console.log('API: PowerSync getBookings returned', bookings.length, 'bookings');
      
      return bookings;
    } catch (error) {
      console.error('API: PowerSync getBookings failed:', error);
      throw error;
    }
  },

  async getBooking(id: string) {
    console.log('API: PowerSync getBooking called for id:', id);
    
    try {
      const db = await getPowerSyncDatabase();
      const dataService = new PowerSyncDataService(db);
      
      const booking = await dataService.getBookingById(id);
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      console.log('API: PowerSync getBooking successful');
      return booking;
    } catch (error) {
      console.error('API: PowerSync getBooking failed:', error);
      throw error;
    }
  },

  async createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) {
    console.log('API: PowerSync createBooking called');
    
    try {
      const db = await getPowerSyncDatabase();
      const dataService = new PowerSyncDataService(db);
      
      const newBooking = await dataService.createBooking(booking);
      console.log('API: PowerSync createBooking successful, id:', newBooking.id);
      
      return newBooking;
    } catch (error) {
      console.error('API: PowerSync createBooking failed:', error);
      throw error;
    }
  },

  async updateBooking(id: string, updates: Partial<Booking>) {
    console.log('API: PowerSync updateBooking called for id:', id);
    
    try {
      const db = await getPowerSyncDatabase();
      const dataService = new PowerSyncDataService(db);
      
      const updatedBooking = await dataService.updateBooking(id, updates);
      console.log('API: PowerSync updateBooking successful');
      
      return updatedBooking;
    } catch (error) {
      console.error('API: PowerSync updateBooking failed:', error);
      throw error;
    }
  },

  // Time Slots - now uses PowerSync
  async getTimeSlots(date: string) {
    console.log('API: PowerSync getTimeSlots called for date:', date);
    
    try {
      const db = await getPowerSyncDatabase();
      const dataService = new PowerSyncDataService(db);
      
      const timeSlots = await dataService.getTimeSlots(date);
      console.log('API: PowerSync getTimeSlots returned', timeSlots.length, 'slots');
      
      return timeSlots;
    } catch (error) {
      console.error('API: PowerSync getTimeSlots failed:', error);
      throw error;
    }
  },

  // Jobs - now uses PowerSync
  async updateJobStatus(jobId: string, status: Job['status']) {
    console.log('API: PowerSync updateJobStatus called for job:', jobId, 'status:', status);
    
    try {
      const db = await getPowerSyncDatabase();
      const dataService = new PowerSyncDataService(db);
      
      const updatedJob = await dataService.updateJobStatus(jobId, status);
      console.log('API: PowerSync updateJobStatus successful');
      
      return updatedJob;
    } catch (error) {
      console.error('API: PowerSync updateJobStatus failed:', error);
      throw error;
    }
  }
};

// Helper function to get PowerSync database
async function getPowerSyncDatabase() {
  const { getPowerSyncDatabase: getDb } = await import('./powersync');
  return getDb();
}