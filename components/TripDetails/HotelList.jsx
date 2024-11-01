import { View, Text, FlatList, Image, Style } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { GetPhotoRef } from '../../services/GooglePlaceApi'
import HotelCard from './HotelCard'

const HotelList = ({hotelList}) => {
    
    
    
  return (
    <View className='mt-7 ml-1 '>
        <View className='flex-row items-center'>
            <Ionicons name="bed" size={22} color="#367AFF" />
            <Text className='font-bold text-[20px]'> Hotels Recommendation</Text>
        </View>
        
        <FlatList 
            className='mt-3 '
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={hotelList}
            renderItem={({item, index})=>(
                <HotelCard
                    item={item}
                />
            )}
        />
        
    </View>
  )
}

export default HotelList