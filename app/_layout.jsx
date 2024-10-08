import React from 'react'
import { Stack } from 'expo-router'
import { AuthProvider } from '../context/authContext'

const RootLayout = () => (
  <AuthProvider>
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
    </Stack>
  </AuthProvider>
);

export default RootLayout;