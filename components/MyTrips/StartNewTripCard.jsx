import { View, Text } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomButton from '../CustomButton';
import { router } from 'expo-router';

const StartNewTripCard = () => {
  return (
    <View className="p-5 mt-12 flex items-center gap-5">
      <Ionicons name="location-sharp" size={30} color="black" />
      <Text className="text-[25px] font-semibold text-center">
        No trips planned yet?
      </Text>
      <Text className="text-[20px] font-normal text-center text-gray-800">
        Its time to plan a new travel experince! Start a new trip now! 
      </Text>
      
      <CustomButton
            title='Start New Trip'
            handlePress={() => router.push('/create-trip/search-place')}
            containerStyles="mt-7 ml-5 w-[190px] h-[55px]"
            textStyles="text-[20px]"
          />
    </View>
  )
}

export default StartNewTripCard