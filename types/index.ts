export interface User {
  id: string;
  email: string;
  name: string;
  tenantId: string;
  role: 'admin' | 'user';
}

export interface Job {
  id: string;
  bookingId: string;
  description?: string;
  status: 'received' | 'in_progress' | 'completed' | 'on_hold' | 'returned';
  photos: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  tenantId: string;
  customerId: string;
  dueDate: string;
  timeEstimate: number;
  description?: string;
  quote?: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  photos: string[];
  customFields: Record<string, any>;
  jobs: Job[];
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
}