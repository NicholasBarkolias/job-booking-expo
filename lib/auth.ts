import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_AUTH_URL || 'http://localhost:3000',
  plugins: [],
});

export type AuthClient = typeof authClient;