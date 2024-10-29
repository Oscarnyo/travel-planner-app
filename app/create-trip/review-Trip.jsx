import { View, Text, TouchableOpacity,FlatList, ToastAndroid } from 'react-native'
import React, { useEffect, useRef, useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { createTripContext } from './../../context/createTripContext';
import CustomButton from '../../components/CustomButton';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import moment from 'moment';

const ReviewTrip = () => {
  
  const {tripData, setTripData} = useContext(createTripContext);
  
  return (
    <SafeAreaView className="bg-backBlue flex-1 h-full">
      <View className='p-6 pt-16'>
      
        <Text
          className='text-[35px] font-bold mt-3'>
          Review Trip
        </Text>
        
        <View className='mt-5'>
          <Text className='text-[20px] font-bold mb-8'>
            Before generating your trip, please review the details
          </Text>
          
          {/* Destination info */}
          <View className='mb-6 flex-row gap-5'>
            {/* <Ionicons name="location-sharp" size={34} color="#367AFF" /> */}
            <Text className='text-[30px]'>📍</Text>
            <View>
              <Text className='font-normal  text-[20px] text-gray-600'>
                Destination
              </Text>
              <Text className='font-semibold text-[20px]'>
                {tripData?.locationInfo?.name}
              </Text>
              
            </View>
          </View>
          
          {/* Date selected info */}
          <View className='mb-6 flex-row gap-5'>
            {/* <Ionicons name="location-sharp" size={34} color="#367AFF" /> */}
            <Text className='text-[30px]'>📅</Text>
            <View>
              <Text className='font-normal  text-[20px] text-gray-600'>
                Travel Dates
              </Text>
              <Text className='font-semibold text-[20px]'>
                {moment(tripData?.startDate).format('DD MMM')} to {moment(tripData?.endDate).format('DD MMM')+"  "} 
                ({tripData?.totalNoOfDays} days)
              </Text>
              
            </View>
          </View>
          
          {/* Traveler selected info */}
          <View className='mb-6 flex-row gap-5'>
            {/* <Ionicons name="location-sharp" size={34} color="#367AFF" /> */}
            <Text className='text-[30px]'>✈️</Text>
            <View>
              <Text className='font-normal  text-[20px] text-gray-600'>
                Who is traveling
              </Text>
              <Text className='font-semibold text-[20px]'>
                {tripData?.traveler?.title} 
              </Text>
              
            </View>
          </View>
          
          {/* Budget selected info */}
          <View className='mb-6 flex-row gap-5'>
            {/* <Ionicons name="location-sharp" size={34} color="#367AFF" /> */}
            <Text className='text-[30px]'>💰</Text>
            <View>
              <Text className='font-normal  text-[20px] text-gray-600'>
                Budget Selected
              </Text>
              <Text className='font-semibold text-[20px]'>
                {tripData?.budget} 
              </Text>
              
            </View>
          </View>
          
          <CustomButton
            title='Build My Trip'
            handlePress={() => router.push('/create-trip/generate-Trip')}
            containerStyles="mt-14 w-[320px] h-[55px] self-center"
            textStyles="text-[20px]"
          />
          
        </View>
      </View>
    </SafeAreaView>
  )
}

export default ReviewTrip