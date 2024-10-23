import { View, Text } from 'react-native'
import React, {useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons';
import StartNewTripCard from '../../components/MyTrips/StartNewTripCard';


const planner = () => {
  const [userTrips, setUserTrips] = useState([])
  
  return (
    <SafeAreaView className="bg-backBlue flex-1">
      <View className="px-4 pt-2">
        <View className="flex flex-row items-center justify-between mb-4">
          <Text className="text-[30px] font-bold">My Trips</Text>
          <Ionicons name="add-circle" size={40} color="#367AFF" />
        </View>
      
        {userTrips.length === 0 && <StartNewTripCard />}
      </View>
    </SafeAreaView>
  )
}

export default planner