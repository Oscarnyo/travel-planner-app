import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)/profile" />;
  } else {
    return <Redirect href="/sign-in" />;
  }
}
