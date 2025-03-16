import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native'
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
  
  const handleContinue = () => {
    if (!selectedTraveler) {
      Alert.alert(
        'Missing Selection',
        'Please select who is traveling before continuing',
        [
          {
            text: 'OK',
            style: 'default'
          }
        ]
      )
      return
    }
    router.push('/create-trip/select-Dates')
  }

  return (
    <SafeAreaView className="bg-backBlue flex-1 h-full">
      <View className='p-6 pt-16'>
        <Text className='text-[35px] font-bold mt-3'>
          Who's Traveling
        </Text>
        
        <View className='mt-5'>
          <Text className='text-[20px] font-bold ml-1'>
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
                <OptionCard option={item} selectedOption={selectedTraveler}/>
              </TouchableOpacity>
            )}
          />
        </View>
        
        <CustomButton
          title='Continue'
          handlePress={handleContinue}
          containerStyles="mt-7 w-[320px] h-[55px] self-center"
          textStyles="text-[20px]"
        />
      </View>
    </SafeAreaView>
  )
}

export default SelectTraveler