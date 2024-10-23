import React, {useState} from 'react'
import { Stack } from 'expo-router'
import { AuthProvider } from '../context/authContext'
import { createTripContext } from '../context/createTripContext'



const RootLayout = () => {
  const [tripData, setTripData] = useState([])
  
  return(
  <AuthProvider>
    <createTripContext.Provider value={{tripData,setTripData}}>
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      <Stack.Screen name="(screens)/favourite" options={{ headerShown: false }} />
      <Stack.Screen name="create-trip/search-place" options={{ headerShown: true, headerTransparent:true, headerTitle:'Search'}} />
      <Stack.Screen name="create-trip/select-Traveler" options={{ headerShown: true, headerTransparent:true, headerTitle:'Traveler'}} />
    </Stack>
    </createTripContext.Provider>
  </AuthProvider>
  
);
}

export default RootLayout;