import { View, Text, TouchableOpacity,FlatList, ToastAndroid } from 'react-native'
import React, { useEffect, useRef, useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { createTripContext } from './../../context/createTripContext';
import CustomButton from '../../components/CustomButton';
import { router } from 'expo-router';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';

const SelectDates = () => {
  
  const[startDate,setStartDate] = useState()
  const[endDate,setEndDate] = useState()
  const {tripData, setTripData} = useContext(createTripContext);
  
  const onDateChange = (date, type) => {
    console.log(date,type)
    if(type === 'START_DATE'){
      setStartDate(moment(date))
    }
    else{
      setEndDate(moment(date))
    }
  }
  
  const OnDateSelectionContinue = () => {
    if(!startDate && !endDate){
      ToastAndroid.show('Please select start and end date', ToastAndroid.SHORT)
      return
    }
    const totalNoOfDays = endDate.diff(startDate, 'days')
    console.log(totalNoOfDays+1)
    setTripData({
      ...tripData,
      startDate:startDate,
      endDate:endDate,
      totalNoOfDays:totalNoOfDays+1
    })
    router.push('/create-trip/select-Budget')
  }
  
  return (
    <SafeAreaView className="bg-backBlue flex-1 h-full">
      <View className='p-6 pt-16'>
        
        <Text
          className='text-[35px] font-bold mt-5'>
          Travel Dates
        </Text>
        
        <View className='mt-6'>
          <CalendarPicker 
          onDateChange={onDateChange}
          allowRangeSelection={true}
          minDate={new Date()}
          selectedDayTextColor='white'
          selectedRangeStyle={{backgroundColor: '#00adf5'}}
          maxRangeDuration={10}
          width={430}
          height={430}
          />
        </View>
        
        <CustomButton
            title='Continue'
            handlePress={OnDateSelectionContinue}
            containerStyles="mt-12 w-full h-[55px]"
            textStyles="text-[20px]"
          />
        
      </View>
    </SafeAreaView>
  )
}

export default SelectDates