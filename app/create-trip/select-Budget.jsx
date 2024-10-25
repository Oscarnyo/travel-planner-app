import { View, Text, TouchableOpacity,FlatList, ToastAndroid } from 'react-native'
import React, { useEffect, useRef, useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { createTripContext } from './../../context/createTripContext';
import CustomButton from '../../components/CustomButton';
import { router } from 'expo-router';

const SelectBudget = () => {
  return (
    <SafeAreaView className="bg-backBlue flex-1 h-full">
      <View className='p-6 pt-16'>
        
        <Text
          className='text-[35px] font-bold mt-5'>
          Travel Budget
        </Text>
        
      </View>
    </SafeAreaView>
  )
}

export default SelectBudget