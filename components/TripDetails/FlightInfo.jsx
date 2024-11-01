import { View, Text, Linking } from 'react-native'
import React from 'react'
import CustomButton from '../../components/CustomButton';

const FlightInfo = ({flightData}) => {
    
    
    const handleBooking = async () => {
        if (flightData?.booking_url) {
          try {
            await Linking.openURL(flightData.booking_url);
          } catch (error) {
            console.error('Error opening URL:', error);
          }
        }
      }
    
  return (
    <View className='mt-5 p-3 rounded-2xl border-[2px] border-gray-300'>
        <Text
        className='font-bold text-[20px] ml-[2px]'
        >✈️ Flight Recommendation</Text>
        
        <Text Text className='font-normal text-[17px] mt-2 ml-[2px]'>Airline: {flightData.airline}</Text>
        
      <View className='flex-row justify-between items-center '>
        <Text className='font-normal text-[17px] ml-[2px]'>Price: {flightData.price}</Text>
      
        <CustomButton 
        title='Book Flight'
        handlePress={handleBooking}
        containerStyles='w-[115px] '
        textStyles='text-[15px]'
      />
      </View>

    </View>
  )
}

export default FlightInfo