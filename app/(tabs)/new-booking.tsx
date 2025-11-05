import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/contexts/AuthContext';
import { useBookings } from '@/contexts/BookingContext';

export default function NewBookingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { createBooking } = useBookings();
  
  const [formData, setFormData] = useState({
    description: '',
    dueDate: '',
    timeEstimate: '',
    quote: '',
    material: '',
    size: '',
  });
  
  const [customFields, setCustomFields] = useState<{ [key: string]: string }>({});
  const [newCustomField, setNewCustomField] = useState({ key: '', value: '' });
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTakePhoto = async () => {
    try {
      // Request camera permissions
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      
      if (cameraPermission.status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is required to take photos');
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const handleChooseFromLibrary = async () => {
    try {
      // Request library permissions
      const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (libraryPermission.status !== 'granted') {
        Alert.alert('Permission Required', 'Photo library permission is required');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to open photo library');
    }
  };

  const validateForm = () => {
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Description is required');
      return false;
    }
    if (!formData.dueDate) {
      Alert.alert('Error', 'Due date is required');
      return false;
    }
    if (!formData.timeEstimate || parseInt(formData.timeEstimate) <= 0) {
      Alert.alert('Error', 'Valid time estimate is required');
      return false;
    }
    if (!selectedPhoto) {
      Alert.alert('Error', 'Photo is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!user) return;

    setIsLoading(true);
    try {
      const bookingData = {
        tenantId: user.tenantId,
        customerId: 'customer-' + Date.now(), // In real app, this would be selected
        dueDate: formData.dueDate,
        timeEstimate: parseInt(formData.timeEstimate),
        description: formData.description,
        quote: formData.quote ? parseFloat(formData.quote) : undefined,
        status: 'pending' as const,
        photos: selectedPhoto ? [selectedPhoto] : [],
        customFields: {
          material: formData.material,
          size: formData.size,
          ...customFields,
        },
        jobs: [],
      };

      await createBooking(bookingData);
      Alert.alert('Success', 'Booking created successfully!');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to create booking');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>New Booking</Text>
        <Text style={styles.subtitle}>Create a new jewellery booking</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Required Information</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={styles.input}
            placeholder="Describe the jewellery work needed"
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Due Date *</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={formData.dueDate}
            onChangeText={(value) => handleInputChange('dueDate', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time Estimate (minutes) *</Text>
          <TextInput
            style={styles.input}
            placeholder="60"
            value={formData.timeEstimate}
            onChangeText={(value) => handleInputChange('timeEstimate', value)}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Photo *</Text>
          {selectedPhoto ? (
            <View style={styles.photoPreview}>
              <Image source={{ uri: selectedPhoto }} style={styles.photoImage} />
              <View style={styles.photoButtons}>
                <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
                  <Text style={styles.photoButtonText}>📷 Retake</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.photoButton} onPress={handleChooseFromLibrary}>
                  <Text style={styles.photoButtonText}>🖼️ Choose</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.photoOptions}>
              <TouchableOpacity style={styles.photoOption} onPress={handleTakePhoto}>
                <Text style={styles.photoOptionText}>📷 Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoOption} onPress={handleChooseFromLibrary}>
                <Text style={styles.photoOptionText}>🖼️ Choose from Library</Text>
              </TouchableOpacity>
            </View>
          )}
          <Text style={styles.photoSubtext}>Photo is required for booking</Text>
        </View>

        <Text style={styles.sectionTitle}>Optional Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Quote ($)</Text>
          <TextInput
            style={styles.input}
            placeholder="150.00"
            value={formData.quote}
            onChangeText={(value) => handleInputChange('quote', value)}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Material</Text>
          <TextInput
            style={styles.input}
            placeholder="Gold, Silver, etc."
            value={formData.material}
            onChangeText={(value) => handleInputChange('material', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Size</Text>
          <TextInput
            style={styles.input}
            placeholder="Ring size, dimensions, etc."
            value={formData.size}
            onChangeText={(value) => handleInputChange('size', value)}
          />
        </View>

        <Text style={styles.sectionTitle}>Custom Fields</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Add Custom Field</Text>
          <View style={styles.customFieldRow}>
            <TextInput
              style={[styles.input, styles.customFieldInput]}
              placeholder="Field name"
              value={newCustomField.key}
              onChangeText={(value) => setNewCustomField(prev => ({ ...prev, key: value }))}
            />
            <TextInput
              style={[styles.input, styles.customFieldInput]}
              placeholder="Value"
              value={newCustomField.value}
              onChangeText={(value) => setNewCustomField(prev => ({ ...prev, value: value }))}
            />
          </View>
          <TouchableOpacity
            style={styles.addCustomFieldButton}
            onPress={() => {
              if (newCustomField.key && newCustomField.value) {
                setCustomFields(prev => ({
                  ...prev,
                  [newCustomField.key]: newCustomField.value
                }));
                setNewCustomField({ key: '', value: '' });
              }
            }}
          >
            <Text style={styles.addCustomFieldText}>+ Add Field</Text>
          </TouchableOpacity>
        </View>

        {Object.entries(customFields).map(([key, value]) => (
          <View key={key} style={styles.customFieldItem}>
            <Text style={styles.customFieldKey}>{key}:</Text>
            <Text style={styles.customFieldValue}>{value}</Text>
            <TouchableOpacity
              style={styles.removeCustomFieldButton}
              onPress={() => setCustomFields(prev => {
                const newFields = { ...prev };
                delete newFields[key];
                return newFields;
              })}
            >
              <Text style={styles.removeCustomFieldText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.submitButton, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Creating...' : 'Create Booking'}
            </Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 4,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  photoPreview: {
    alignItems: 'center',
  },
  photoImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  photoButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    alignItems: 'center',
  },
  photoButtonText: {
    fontSize: 14,
    color: '#666',
  },
  photoOptions: {
    gap: 12,
  },
  photoOption: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  photoOptionText: {
    fontSize: 16,
    color: '#333',
  },
  photoSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  customFieldRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  customFieldInput: {
    flex: 1,
  },
  addCustomFieldButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  addCustomFieldText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  customFieldItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  customFieldKey: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  customFieldValue: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  removeCustomFieldButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeCustomFieldText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});