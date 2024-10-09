import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'

import { useState } from 'react'


import { Ionicons } from '@expo/vector-icons'; 

const FormField = ({title, value, placeholder, handleChangeText, otherStyles, editable = true, valueTextColor = 'text-black', titleColor = 'text-black', ...props}) => {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className={`text-base font-medium ${titleColor}`}>{title}</Text>
      
      <View className="w-full h-14 px-4 bg-backBlue border-borderGrey border-2 rounded-lg focus:border-secondary items-center flex-row"> 
        <TextInput
          className={`flex-1 ${valueTextColor} font-semibold text-base`}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={'#7b7b8b'}
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' && !showPassword}
          editable={editable}
          {...props}
        />
        {title === 'Password' && editable && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={!showPassword ? 'eye-off' : 'eye'}
              size={24}
              color="gray"
              className="w-6 h-6"
              resizeMode='contain'
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField