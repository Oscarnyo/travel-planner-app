import { View, Text, TouchableOpacity,FlatList, ToastAndroid } from 'react-native'
import React, { useEffect, useRef, useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { createTripContext } from './../../context/createTripContext';
import CustomButton from '../../components/CustomButton';
import { router } from 'expo-router';
import { SelectBudgetOptions } from '../../constants/options';
import OptionCard from '../../components/CreateTrip/OptionCard';

const SelectBudget = () => {
  
  const [selectedOption, setSelectedOption] = useState()
  const {tripData, setTripData} = useContext(createTripContext);
  
  useEffect(() => {
    selectedOption && setTripData({
      ...tripData,
      budget:selectedOption?.title
    })
  },[selectedOption])
  
  const onClickContinue = () => {
    if(!selectedOption){
      ToastAndroid.show('Please select a budget option', ToastAndroid.SHORT)
      return
    }
    router.push('/create-trip/review-Trip')
  }  
  
  return (
    <SafeAreaView className="bg-backBlue flex-1 h-full">
      <View className='p-6 pt-16'>
        
        <Text
          className='text-[35px] font-bold mt-3'>
          Travel Budget
        </Text>
        <View className='mt-5'>
          <Text className='text-[20px] font-bold ml-1'>
            Choose spending habits for your trip
          </Text>
        </View>
        
        <FlatList 
          data={SelectBudgetOptions}
          renderItem={({item, index}) => (
            <TouchableOpacity 
            className=" my-4" 
            onPress={()=> setSelectedOption(item)}
            activeOpacity={1}
            >
              <OptionCard
                option={item}
                selectedOption={selectedOption}
              />
            </TouchableOpacity>
          )}
        />
        
        <CustomButton
            title='Continue'
            handlePress={() => onClickContinue()}
            containerStyles="mt-8 w-[320px] h-[55px] self-center"
            textStyles="text-[20px]"
          />
        
      </View>
    </SafeAreaView>
  )
}

export default SelectBudget