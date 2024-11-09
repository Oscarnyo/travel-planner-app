import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { GOOGLE_MAPS_API_KEY } from '@env'
import { GetPhotoRef } from '../services/GooglePlaceApi'

const CustomPlaceCard = ({ place }) => {
    const [photoRef, setPhotoRef] = useState(null)
    
    useEffect(() => {
        GetGooglePhoto()
    }, [place.place_name])
    
    const GetGooglePhoto = async () => {
        try {
            const result = await GetPhotoRef(place.place_name)
            setPhotoRef(result)
        } catch (error) {
            console.error('Error fetching photo:', error)
        }
    }

    return (
        <View>
            {photoRef ? (
                <Image
                    className='w-full h-[180] rounded-2xl'
                    source={{
                        uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${GOOGLE_MAPS_API_KEY}`
                    }}
                />
            ) : (
                <View className='w-full h-[180] rounded-2xl bg-gray-300 justify-center items-center'>
                    <Text className='text-gray-500 text-lg'>No Image</Text>
                </View>
            )}
            
            <View className='mt-2'>
                <Text className='font-bold text-[20px] mb-1'>
                    {place.place_name}
                </Text>
                
                <Text className='font-normal text-[14px] text-gray-500 mb-2'>
                    {place.place_details}
                </Text>
                
                <View className='flex-row items-center'>
                    <Ionicons name="time-outline" size={16} color="#367AFF" />
                    <Text className='font-normal text-[14px] text-gray-500 ml-1'>
                        {place.is_open ? "Open Now" : "Closed"}
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default CustomPlaceCard