import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { GOOGLE_MAPS_API_KEY } from '@env'
import { router } from 'expo-router'

const PlaceItem = ({ place }) => {
  const handlePress = async () => {
    try {
      router.push({
        pathname: '/(screens)/PlaceDetails',
        params: { 
          locationId: place.place_id,
          name: place.name,
          type: 'place',
          photoUrl: place.photos?.[0] ? 
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_MAPS_API_KEY}` 
            : null
        }
      })
    } catch (error) {
      console.error('Error navigating to place details:', error)
      Alert.alert('Error', 'Failed to load place details')
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
        {place.photos?.[0]?.photo_reference ? (
          <Image
            source={{ 
              uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_MAPS_API_KEY}`
            }}
            className="w-full h-[140] rounded-t-2xl"
          />
        ) : (
          <View className="w-full h-[150] rounded-t-xl bg-gray-300 justify-center items-center">
            <Text className="text-gray-500">No Image</Text>
          </View>
        )}
        
        <View className="p-3">
          <Text className="font-bold text-[16px] mb-1" numberOfLines={1}>
            {place.name}
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text className="ml-1 text-gray-600">
              {place.rating} ({place.user_ratings_total} reviews)
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default PlaceItem