import { Booking, Job, User, TimeSlot } from '@/types';

// Dummy data for development
const dummyUsers: User[] = [
  {
    id: '1',
    email: 'admin@jeweller.com',
    name: 'Admin User',
    tenantId: 'tenant-1',
    role: 'admin'
  },
  {
    id: '2',
    email: 'user@jeweller.com',
    name: 'Regular User',
    tenantId: 'tenant-1',
    role: 'user'
  }
];

const dummyBookings: Booking[] = [
  {
    id: '1',
    tenantId: 'tenant-1',
    customerId: 'customer-1',
    dueDate: '2025-11-10T10:00:00Z',
    timeEstimate: 120,
    description: 'Ring resizing and cleaning',
    quote: 150,
    status: 'in_progress',
    photos: ['photo1.jpg'],
    customFields: { material: 'gold', size: '7' },
    jobs: [
      {
        id: 'job-1',
        bookingId: '1',
        status: 'in_progress',
        photos: ['job-photo1.jpg'],
        createdAt: '2025-11-05T09:00:00Z',
        updatedAt: '2025-11-05T09:00:00Z'
      }
    ],
    createdAt: '2025-11-05T08:00:00Z',
    updatedAt: '2025-11-05T09:00:00Z'
  },
  {
    id: '2',
    tenantId: 'tenant-1',
    customerId: 'customer-2',
    dueDate: '2025-11-08T14:00:00Z',
    timeEstimate: 60,
    description: 'Necklace clasp repair',
    quote: 75,
    status: 'confirmed',
    photos: ['photo2.jpg'],
    customFields: { material: 'silver' },
    jobs: [],
    createdAt: '2025-11-05T10:00:00Z',
    updatedAt: '2025-11-05T10:00:00Z'
  }
];

const dummyTimeSlots: TimeSlot[] = [
  { id: '1', startTime: '2025-11-06T09:00:00Z', endTime: '2025-11-06T10:00:00Z', available: true },
  { id: '2', startTime: '2025-11-06T10:00:00Z', endTime: '2025-11-06T11:00:00Z', available: false },
  { id: '3', startTime: '2025-11-06T11:00:00Z', endTime: '2025-11-06T12:00:00Z', available: true },
];

// Mock API functions
export const api = {
  // Auth
  async login(email: string, _password: string): Promise<User> {
    console.log('API: login called with', email);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const user = dummyUsers.find(u => u.email === email);
    console.log('API: found user:', user);
    if (!user) throw new Error('Invalid credentials');
    console.log('API: returning user');
    return user;
  },

  async logout(): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  // Bookings
  async getBookings(tenantId: string): Promise<Booking[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return dummyBookings.filter(b => b.tenantId === tenantId);
  },

  async getBooking(id: string): Promise<Booking> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const booking = dummyBookings.find(b => b.id === id);
    if (!booking) throw new Error('Booking not found');
    return booking;
  },

  async createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    dummyBookings.push(newBooking);
    return newBooking;
  },

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const index = dummyBookings.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Booking not found');
    dummyBookings[index] = { ...dummyBookings[index], ...updates, updatedAt: new Date().toISOString() };
    return dummyBookings[index];
  },

  // Time Slots
  async getTimeSlots(_date: string): Promise<TimeSlot[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return dummyTimeSlots;
  },

  // Jobs
  async updateJobStatus(jobId: string, status: Job['status']): Promise<Job> {
    await new Promise(resolve => setTimeout(resolve, 500));
    for (const booking of dummyBookings) {
      const job = booking.jobs.find(j => j.id === jobId);
      if (job) {
        job.status = status;
        job.updatedAt = new Date().toISOString();
        return job;
      }
    }
    throw new Error('Job not found');
  }
};