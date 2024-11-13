import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { GOOGLE_MAPS_API_KEY } from '@env'

const PlaceItem = ({ place }) => {
  const getPlaceImage = () => {
    if (place.photos && place.photos[0]?.photo_reference) {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_MAPS_API_KEY}`;
    }
    return null;
  };

  return (
    <View 
      className="bg-white rounded-2xl shadow-sm mb-4 mr-4"
      style={{
        width: 200,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
      }}
    >
      {getPlaceImage() ? (
        <Image
          source={{ uri: getPlaceImage() }}
          className="w-full h-[130] rounded-t-2xl"
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
  )
}

export default PlaceItem