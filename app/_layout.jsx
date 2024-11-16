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
      <Stack.Screen name="(auth)/sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/forgot-password" options={{ headerShown: false }} />
      <Stack.Screen name="(screens)/favourite" options={{ headerShown: false }} />
      <Stack.Screen name="create-trip/search-place" options={{ headerShown: true, headerTransparent:true, headerTitle:'Search'}} />
      <Stack.Screen name="create-trip/select-Traveler" options={{ headerShown: true, headerTransparent:true, headerTitle:''}} />
      <Stack.Screen name="create-trip/select-Dates" options={{ headerShown: true, headerTransparent:true, headerTitle:''}} />
      <Stack.Screen name="create-trip/select-Budget" options={{ headerShown: true, headerTransparent:true, headerTitle:''}} />
      <Stack.Screen name="create-trip/review-Trip" options={{ headerShown: true, headerTransparent:true, headerTitle:''}} />
      <Stack.Screen name="create-trip/generate-Trip" options={{ headerShown: false, headerTransparent:true, headerTitle:''}} />
      <Stack.Screen name="trip-details/index" options={{ headerShown: false, headerTransparent:true, headerTitle:''}} />
      <Stack.Screen name="(screens)/SearchLocation" options={{ headerShown: true, headerTransparent:true, headerTitle:'Search'}} />
      <Stack.Screen name="(screens)/notes" options={{ headerShown: true, headerTransparent:true, headerTitle:'Note'}} />
      <Stack.Screen name="(screens)/PlaceDetails" options={{ headerShown: false, headerTransparent:false, headerTitle:''}} />
      <Stack.Screen name="(screens)/chatbot" options={{ headerShown: false, headerTransparent:true, headerTitle:'Chat Bot'}} />
      <Stack.Screen name="(screens)/CountryDetails" options={{ headerShown: false, headerTransparent:true, headerTitle:''}} />
      <Stack.Screen name="(screens)/addExpense" options={{ headerShown: false, headerTransparent:true, headerTitle:'Add Expense'}} />
      <Stack.Screen name="(screens)/expenseDetails" options={{ headerShown: false, headerTransparent:true, headerTitle:''}} />
      <Stack.Screen name="(screens)/addCategory" options={{ headerShown: false, headerTransparent:true, headerTitle:''}} />
      <Stack.Screen name="(screens)/currencyConverter" options={{ headerShown: false, headerTransparent:true, headerTitle:'Currency Converter'}} />
    </Stack>
    </createTripContext.Provider>
  </AuthProvider>
  
);
}

export default RootLayout;