import { View, Text, ActivityIndicator, ScrollView } from 'react-native'
import React, {useEffect, useState} from 'react'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons';
import StartNewTripCard from '../../components/MyTrips/StartNewTripCard';
import {db, auth} from '../../firebaseConfig';
import {collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { set } from 'date-fns';
import UserTripList from '../../components/MyTrips/UserTripList';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';


const planner = () => {
  const [userTrips, setUserTrips] = useState([])
  const user = auth.currentUser
  const [loading, setLoading] = useState(false)
  
  
  
  useEffect(() => {
    if (user) {
      const q = query(collection(db, "users"), where("userEmail", "==", user?.email));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let trips = [];
        querySnapshot.forEach((doc) => {
          trips.push(doc.data());
        });
        
        // Sort trips by closest date
        const now = new Date();
        trips.sort((a, b) => {
          const dateA = new Date(JSON.parse(a.tripData).startDate);
          const dateB = new Date(JSON.parse(b.tripData).startDate);
          const diffA = Math.abs(dateA - now);
          const diffB = Math.abs(dateB - now);
          return diffA - diffB;
        });
        
        setUserTrips(trips);
      });
      
      return () => unsubscribe();
    }
  }, [user]);
  
  return (
    
    <SafeAreaView className="bg-backBlue flex-1">
      <View className="flex-1">
        {/* Header */}
        <View className="px-5 bg-backBlue mt-2">
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
      <StatusBar style="dark" backgroundColor="#E5E8F8" />
    </SafeAreaView>
  )
}

export default planner