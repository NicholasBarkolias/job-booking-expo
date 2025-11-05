import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useBookings } from '@/contexts/BookingContext';
import { Booking, Job } from '@/types';

export default function BookingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bookings, updateBooking } = useBookings();
  
  const [booking] = bookings.filter(b => b.id === id);
  const [isLoading, setIsLoading] = useState(false);

  if (!booking) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Booking not found</Text>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#007AFF';
      case 'in_progress': return '#FF9500';
      case 'completed': return '#34C759';
      case 'cancelled': return '#FF3B30';
      case 'pending': return '#8E8E93';
      default: return '#8E8E93';
    }
  };

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'received': return '#007AFF';
      case 'in_progress': return '#FF9500';
      case 'completed': return '#34C759';
      case 'on_hold': return '#FF9500';
      case 'returned': return '#34C759';
      default: return '#8E8E93';
    }
  };

  const handleStatusChange = async (newStatus: Booking['status']) => {
    setIsLoading(true);
    try {
      await updateBooking(booking.id, { status: newStatus });
      Alert.alert('Success', 'Booking status updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobStatusChange = async (jobId: string, newStatus: Job['status']) => {
    try {
      // In a real app, this would call the API
      Alert.alert('Success', 'Job status updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update job status');
    }
  };

  const statusOptions: Booking['status'][] = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
  const jobStatusOptions: Job['status'][] = ['received', 'in_progress', 'completed', 'on_hold', 'returned'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{booking.description || 'Untitled Booking'}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
          <Text style={styles.statusText}>{booking.status.replace('_', ' ')}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Booking Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Due Date:</Text>
          <Text style={styles.infoValue}>
            {new Date(booking.dueDate).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Time Estimate:</Text>
          <Text style={styles.infoValue}>{booking.timeEstimate} minutes</Text>
        </View>
        
        {booking.quote && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Quote:</Text>
            <Text style={styles.infoValue}>${booking.quote}</Text>
          </View>
        )}
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Created:</Text>
          <Text style={styles.infoValue}>
            {new Date(booking.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {Object.keys(booking.customFields).length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Custom Fields</Text>
          {Object.entries(booking.customFields).map(([key, value]) => (
            <View key={key} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
              <Text style={styles.infoValue}>{value}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Update Status</Text>
        <View style={styles.statusGrid}>
          {statusOptions.map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusButton,
                booking.status === status && styles.statusButtonActive,
                { backgroundColor: getStatusColor(status) }
              ]}
              onPress={() => handleStatusChange(status)}
              disabled={isLoading}
            >
              <Text style={[
                styles.statusButtonText,
                booking.status === status && styles.statusButtonTextActive
              ]}>
                {status.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Jobs ({booking.jobs.length})</Text>
        
        {booking.jobs.length === 0 ? (
          <Text style={styles.emptyText}>No jobs yet</Text>
        ) : (
          booking.jobs.map(job => (
            <View key={job.id} style={styles.jobCard}>
              <View style={styles.jobHeader}>
                <Text style={styles.jobTitle}>Job #{job.id}</Text>
                <View style={[styles.jobStatusBadge, { backgroundColor: getJobStatusColor(job.status) }]}>
                  <Text style={styles.jobStatusText}>{job.status.replace('_', ' ')}</Text>
                </View>
              </View>
              
              <View style={styles.jobDetails}>
                <Text style={styles.jobDate}>
                  Created: {new Date(job.createdAt).toLocaleDateString()}
                </Text>
                <Text style={styles.jobPhotos}>
                  {job.photos.length} photo{job.photos.length !== 1 ? 's' : ''}
                </Text>
              </View>

              {job.updatedAt !== job.createdAt && (
                <View style={styles.jobProgress}>
                  <Text style={styles.progressTitle}>Progress History</Text>
                  <View style={styles.progressItem}>
                    <Text style={styles.progressDate}>
                      Updated: {new Date(job.updatedAt).toLocaleDateString()}
                    </Text>
                    <Text style={styles.progressStatus}>
                      Status: {job.status.replace('_', ' ')}
                    </Text>
                  </View>
                </View>
              )}
              
              <View style={styles.jobStatusGrid}>
                {jobStatusOptions.map(status => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.jobStatusButton,
                      job.status === status && styles.jobStatusButtonActive,
                      { backgroundColor: getJobStatusColor(status) }
                    ]}
                    onPress={() => handleJobStatusChange(job.id, status)}
                  >
                    <Text style={[
                      styles.jobStatusButtonText,
                      job.status === status && styles.jobStatusButtonTextActive
                    ]}>
                      {status.replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Booking History</Text>
        
        <View style={styles.historyItem}>
          <Text style={styles.historyDate}>
            {new Date(booking.createdAt).toLocaleDateString()} {new Date(booking.createdAt).toLocaleTimeString()}
          </Text>
          <Text style={styles.historyAction}>Booking created</Text>
        </View>
        
        {booking.updatedAt !== booking.createdAt && (
          <View style={styles.historyItem}>
            <Text style={styles.historyDate}>
              {new Date(booking.updatedAt).toLocaleDateString()} {new Date(booking.updatedAt).toLocaleTimeString()}
            </Text>
            <Text style={styles.historyAction}>Status updated to {booking.status.replace('_', ' ')}</Text>
          </View>
        )}
        
        {booking.jobs.map(job => (
          <View key={job.id} style={styles.historyItem}>
            <Text style={styles.historyDate}>
              {new Date(job.createdAt).toLocaleDateString()} {new Date(job.createdAt).toLocaleTimeString()}
            </Text>
            <Text style={styles.historyAction}>Job #{job.id} created</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Photos ({booking.photos.length})</Text>
        
        {booking.photos.length === 0 ? (
          <Text style={styles.emptyText}>No photos</Text>
        ) : (
          <View style={styles.photoGrid}>
            {booking.photos.map((photo, index) => (
              <View key={index} style={styles.photoItem}>
                <Text style={styles.photoText}>Photo {index + 1}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
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
    color: '#333',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  statusButtonActive: {
    opacity: 0.8,
  },
  statusButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  statusButtonTextActive: {
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 100,
  },
  jobCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  jobStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  jobStatusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  jobDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  jobDate: {
    fontSize: 14,
    color: '#666',
  },
  jobPhotos: {
    fontSize: 14,
    color: '#666',
  },
  jobStatusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  jobStatusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 70,
    alignItems: 'center',
  },
  jobStatusButtonActive: {
    opacity: 0.8,
  },
  jobStatusButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  jobStatusButtonTextActive: {
    fontWeight: 'bold',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoItem: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 100,
  },
  photoText: {
    fontSize: 14,
    color: '#666',
  },
  jobProgress: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  progressItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressDate: {
    fontSize: 12,
    color: '#666',
  },
  progressStatus: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyDate: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  historyAction: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
});