import React, { useState } from 'react';
import { View, Text, Alert, Pressable, TextInput } from 'react-native';

export default function SimpleLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    Alert.alert('Login', `Email: ${email}, Password: ${password}`);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'white' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
        Simple Login Test
      </Text>
      
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
      />
      
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 20,
          borderRadius: 5,
        }}
      />
      
      <Pressable
        onPress={handleLogin}
        style={{
          backgroundColor: '#007AFF',
          padding: 15,
          borderRadius: 5,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          Sign In
        </Text>
      </Pressable>
    </View>
  );
}