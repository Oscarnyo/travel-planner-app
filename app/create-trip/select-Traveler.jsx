import { View, Text, TouchableOpacity,FlatList } from 'react-native'
import React, { useEffect, useRef, useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { createTripContext } from './../../context/createTripContext';
import { SelectTravelerList } from '../../constants/options';
import OptionCard from '../../components/CreateTrip/OptionCard';
import CustomButton from '../../components/CustomButton';
import { router } from 'expo-router';

const SelectTraveler = () => {
  
  const [selectedTraveler, setSelectedTraveler] = useState()
  const {tripData, setTripData} = useContext(createTripContext); 
  
  useEffect(() => {
    setTripData({...tripData,
      traveler:selectedTraveler
    })
  },[selectedTraveler])
  
  useEffect(() => {
    console.log(tripData)
  },[tripData])
  
  return (
    <SafeAreaView className="bg-backBlue flex-1 h-full">
      <View className='p-6 pt-16'>
        
        <Text
          className='text-[35px] font-bold mt-5'>
          Who's Traveling
        </Text>
        
        <View className='mt-5'>
          <Text className='text-[20px] font-bold'>
            Choose your traveler
          </Text>
          
          <FlatList
            data={SelectTravelerList}
            renderItem={({item, index}) => (
              <TouchableOpacity 
              className=" my-3"
              onPress={() => setSelectedTraveler(item)}
              activeOpacity={1}
              >
                <OptionCard option={item} selectedTraveler={selectedTraveler}/>
                
              </TouchableOpacity>
            )}
          />
          
        </View>
        <CustomButton
            title='Continue'
            handlePress={() => router.push('/create-trip/select-Dates')}
            containerStyles="mt-6 w-full h-[55px]"
            textStyles="text-[20px]"
          />
        
      </View>
    </SafeAreaView>
  )
}

export default SelectTraveler