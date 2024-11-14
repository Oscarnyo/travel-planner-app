import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

const RestaurantItem = ({ restaurant }) => {
  const handlePress = async () => {
    try {
      router.push({
        pathname: '/(screens)/PlaceDetails',
        params: { 
          locationId: restaurant.location_id,
          name: restaurant.name,
          type: 'restaurant',
          photoUrl: restaurant.photo?.images?.medium?.url || null
        }
      })
    } catch (error) {
      console.error('Error navigating to restaurant details:', error)
      Alert.alert('Error', 'Failed to load restaurant details')
    }
  }

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <View 
        className="bg-white rounded-2xl shadow-sm mb-4 flex-row"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 3,
        }}
      >
        <View className="w-1/3">
          {restaurant.photo?.images?.medium?.url ? (
            <Image
              source={{ uri: restaurant.photo.images.medium.url }}
              className="w-full h-[100] rounded-l-2xl"
            />
          ) : (
            <View className="w-full h-[100] rounded-l-2xl bg-gray-300 justify-center items-center">
              <Text className="text-gray-500">No Image</Text>
            </View>
          )}
        </View>
        
        <View className="flex-1 p-3 justify-between">
          <View>
            <Text className="font-bold text-[16px] mb-1" numberOfLines={1}>
              {restaurant.name}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text className="ml-1 text-gray-600">
                {restaurant.rating} ({restaurant.num_reviews} reviews)
              </Text>
            </View>
          </View>
          <Text className="text-gray-600 text-sm">
            {restaurant.price_level ? '💰'.repeat(restaurant.price_level) : 'Price N/A'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default RestaurantItem