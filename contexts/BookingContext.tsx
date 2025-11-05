import React, { createContext, useContext, useState } from 'react';
import { Booking } from '@/types';
import { api } from '@/lib/api';

interface BookingContextType {
  bookings: Booking[];
  isLoading: boolean;
  fetchBookings: (tenantId: string) => Promise<void>;
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Booking>;
  updateBooking: (id: string, updates: Partial<Booking>) => Promise<Booking>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBookings = async (tenantId: string) => {
    setIsLoading(true);
    try {
      const bookings = await api.getBookings(tenantId);
      setBookings(bookings);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createBooking = async (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newBooking = await api.createBooking(booking);
      setBookings(prev => [...prev, newBooking]);
      return newBooking;
    } catch (error) {
      console.error('Failed to create booking:', error);
      throw error;
    }
  };

  const updateBooking = async (id: string, updates: Partial<Booking>) => {
    try {
      const updatedBooking = await api.updateBooking(id, updates);
      setBookings(prev => prev.map(b => b.id === id ? updatedBooking : b));
      return updatedBooking;
    } catch (error) {
      console.error('Failed to update booking:', error);
      throw error;
    }
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      isLoading,
      fetchBookings,
      createBooking,
      updateBooking
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
}