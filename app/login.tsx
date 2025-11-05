import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input, Card, CardHeader, CardContent, Label } from '@/components/ui';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    console.log('Login attempt with email:', email);
    
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      console.log('Calling login function...');
      await login(email, password);
      console.log('Login successful!');
      // Navigate to the main app after successful login
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', `Invalid email or password: ${error}`);
    }
  };

  return (
    <View className="flex-1 justify-center p-5 bg-white">
      <Text className="text-4xl font-bold text-center mb-2 text-gray-800">Jewellery Booking</Text>
      <Text className="text-base text-center mb-10 text-gray-600">Sign in to your account</Text>
      
      <Card className="mb-8">
        <CardHeader className="pb-4">
          <Label className="text-sm font-medium mb-2">Email</Label>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            className="mb-4"
          />
          
          <Label className="text-sm font-medium mb-2">Password</Label>
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="mb-4"
          />
        </CardHeader>
        
        <CardContent>
          <Button
            onPress={handleLogin}
            disabled={isLoading}
            className={`${isLoading ? 'bg-gray-400' : 'bg-blue-500'}`}
          >
            <Text className="text-white font-semibold">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Text>
          </Button>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-100">
        <CardContent className="p-4">
          <Text className="text-sm text-gray-600 mb-1">Demo Credentials:</Text>
          <Text className="text-sm text-gray-600 mb-1">Email: admin@jeweller.com</Text>
          <Text className="text-sm text-gray-600">Password: any</Text>
        </CardContent>
      </Card>
    </View>
  );
}