import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const CustomButton = ({title, handlePress, containerStyles, textStyles, isLoading}) => {
  return (
    <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        style={{
            borderRadius: 12,
        }}
        className={` bg-secondary  min-h-[34px] justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
        disabled={isLoading}
    >
        <Text className={` text-slate-100 font-semibold text-[21px] ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton