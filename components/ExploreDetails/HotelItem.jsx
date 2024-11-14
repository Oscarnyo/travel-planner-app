import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import React, {useEffect} from 'react'
import { Ionicons } from '@expo/vector-icons'
import { GOOGLE_MAPS_API_KEY } from '@env'
import { router } from 'expo-router'


const HotelItem = ({ hotel }) => {
  
  const handlePress = async () => {
    try {
      router.push({
        pathname: '/(screens)/PlaceDetails',
        params: { 
          locationId: hotel.location_id,
          name: hotel.name,
          type: 'hotel',
          photoUrl: hotel.photo?.images?.medium?.url || null
        }
      })
    } catch (error) {
      console.error('Error navigating to hotel details:', error)
      Alert.alert('Error', 'Failed to load hotel details')
    }
  }

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <View 
        className="bg-white rounded-2xl shadow-sm mb-4 mr-4"
        style={{
          width: 200,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 3,
        }}
      >
        {hotel.photo?.images?.medium?.url ? (
          <Image
            source={{ uri: hotel.photo.images.medium.url }}
            className="w-full h-[140] rounded-t-2xl"
          />
        ) : (
          <View className="w-full h-[130] rounded-t-xl bg-gray-300 justify-center items-center">
            <Text className="text-gray-500">No Image</Text>
          </View>
        )}
        
        <View className="p-3">
          <Text className="font-bold text-[16px] mb-1" numberOfLines={1}>
            {hotel.name}
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text className="ml-1 text-gray-600">
              {hotel.rating} ({hotel.num_reviews} reviews)
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default HotelItem