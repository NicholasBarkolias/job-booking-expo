import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useAuth } from '@/contexts/AuthContext';
import { useBookings } from '@/contexts/BookingContext';
import { Booking } from '@/types';

export default function CalendarScreen() {
  const { user } = useAuth();
  const { bookings } = useBookings();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [markedDates, setMarkedDates] = useState<any>({});

  useEffect(() => {
    if (bookings.length > 0) {
      const marks: any = {};
      
      bookings.forEach(booking => {
        const date = booking.dueDate.split('T')[0];
        const statusColor = getStatusColor(booking.status);
        
        marks[date] = {
          marked: true,
          dotColor: statusColor,
          activeOpacity: 0,
        };
      });
      
      setMarkedDates(marks);
    }
  }, [bookings]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#007AFF';
      case 'in_progress': return '#FF9500';
      case 'completed': return '#34C759';
      case 'cancelled': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  const getBookingsForDate = (date: string) => {
    return bookings.filter(booking => 
      booking.dueDate.split('T')[0] === date
    );
  };

  const onDayPress = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const selectedDateBookings = selectedDate ? getBookingsForDate(selectedDate) : [];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendar</Text>
        <Text style={styles.subtitle}>View booking availability</Text>
      </View>

      <Calendar
        onDayPress={onDayPress}
        markedDates={{
          ...markedDates,
          [selectedDate]: { 
            selected: true, 
            marked: markedDates[selectedDate]?.marked,
            dotColor: markedDates[selectedDate]?.dotColor,
            selectedColor: '#007AFF',
            selectedTextColor: '#fff'
          }
        }}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#007AFF',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#007AFF',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#00adf5',
          selectedDotColor: '#ffffff',
          arrowColor: '#007AFF',
          monthTextColor: '#2d4150',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
        }}
      />

      {selectedDate && (
        <View style={styles.bookingsSection}>
          <Text style={styles.sectionTitle}>
            Bookings for {new Date(selectedDate).toLocaleDateString()}
          </Text>
          
          {selectedDateBookings.length === 0 ? (
            <Text style={styles.emptyText}>No bookings for this date</Text>
          ) : (
            selectedDateBookings.map(booking => (
              <TouchableOpacity key={booking.id} style={styles.bookingCard}>
                <View style={styles.bookingHeader}>
                  <Text style={styles.bookingTitle}>{booking.description}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
                    <Text style={styles.statusText}>{booking.status.replace('_', ' ')}</Text>
                  </View>
                </View>
                <Text style={styles.bookingTime}>Est. {booking.timeEstimate} minutes</Text>
                {booking.quote && (
                  <Text style={styles.bookingQuote}>Quote: ${booking.quote}</Text>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  bookingsSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
  bookingCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  bookingTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bookingQuote: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});