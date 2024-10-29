import { View, Text, ActivityIndicator } from 'react-native'
import React, {useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons';
import StartNewTripCard from '../../components/MyTrips/StartNewTripCard';
import {db, auth} from '../../firebaseConfig';
import { collection } from 'firebase/firestore';
import { getDocs, query, where } from 'firebase/firestore';
import { set } from 'date-fns';
import UserTripList from '../../components/MyTrips/UserTripList';


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
    
    querySnapshot.forEach((doc) => {
      // setUserTrips([...userTrips, doc.data()])
      console.log(doc.id, " => ", doc.data());
      setUserTrips(prev=>[...prev, doc.data()])
    });
    setLoading(false)
  }
  
  return (
    <SafeAreaView className="bg-backBlue flex-1">
      
      <View className="px-5 pt-2">
        <View className="flex flex-row items-center justify-between mb-4">
          <Text className="text-[30px] font-bold">My Trips</Text>
          <Ionicons name="add-circle" size={40} color="#367AFF" />
        </View>
        
        {loading&&<ActivityIndicator size="large" color="#0000ff" />}
        
        {userTrips?.length == 0? 
          <StartNewTripCard />
          :
          <UserTripList userTrips={userTrips}/>
        }
        
      </View>
    </SafeAreaView>
  )
}

export default planner