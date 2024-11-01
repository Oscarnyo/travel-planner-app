import { View, Text, ActivityIndicator, ScrollView } from 'react-native'
import React, {useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons';
import StartNewTripCard from '../../components/MyTrips/StartNewTripCard';
import {db, auth} from '../../firebaseConfig';
import { collection } from 'firebase/firestore';
import { getDocs, query, where } from 'firebase/firestore';
import { set } from 'date-fns';
import UserTripList from '../../components/MyTrips/UserTripList';
import { router } from 'expo-router';


const planner = () => {
  const [userTrips, setUserTrips] = useState([])
  const user = auth.currentUser
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    user && GetMyTrips()
  },[user])
  
  const GetMyTrips = async () => {
    setLoading(true)
    setUserTrips([])
    const q = query(collection(db, "users"), where ("userEmail", "==", user?.email));
    const querySnapshot = await getDocs(q);
    
    let trips = [];
    querySnapshot.forEach((doc) => {
      trips.push(doc.data());
    });
  
    // Get current date for comparison
    const now = new Date();
  
    // Sort trips by how close the start date is to current date
    trips.sort((a, b) => {
      const dateA = new Date(JSON.parse(a.tripData).startDate);
      const dateB = new Date(JSON.parse(b.tripData).startDate);
      
      // Calculate difference from now
      const diffA = Math.abs(dateA - now);
      const diffB = Math.abs(dateB - now);
      
      return diffA - diffB; // Closest dates first
    });
    
    setUserTrips(trips);
    setLoading(false)
  }
  
  return (
    <SafeAreaView edges={['top']} className="bg-backBlue flex-1">
      <View className="flex-1">
        {/* Header */}
        <View className="px-5 py-2 bg-backBlue">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-[30px] font-bold">My Trips</Text>
            <Ionicons name="add-circle" size={40} color="#367AFF" 
              onPress={() => router.push('/create-trip/search-place')} 
            />
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView 
          contentContainerStyle={{ paddingBottom: 30 }}
          className="px-5"
        > 
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
          
          {userTrips?.length == 0 ? 
            <StartNewTripCard />
            :
            <UserTripList userTrips={userTrips}/>
          }
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default planner