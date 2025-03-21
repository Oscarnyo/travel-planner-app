import { View, Text } from 'react-native'
import React from 'react'

const OptionCard = ({option, selectedOption}) => {
  return (
    <View 
    className='p-6 flex-row justify-between bg-[#d9dbe6] rounded-2xl'
    style={[{
        
    }, selectedOption?.id == option?.id&&{borderWidth:2}]}>
    
        <View>
            <Text className='text-[20px] font-medium'>
            {option?.title}
            </Text>
            
            <Text className='text-[17px] font-normal text-gray-500'>
            {option?.desc}
            </Text>

        </View>
        
        <Text className="text-[30px]">
            {option?.icon}
        </Text>
        
    </View>
  )
}

export default OptionCard