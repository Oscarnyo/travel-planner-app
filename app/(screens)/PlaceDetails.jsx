import { View, Text, Image, ScrollView, TouchableOpacity, Linking, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { GOOGLE_MAPS_API_KEY } from '@env'

const PlaceDetails = () => {
  const params = useLocalSearchParams()
  const [placeDetails, setPlaceDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPlaceDetails()
  }, [])

  const fetchPlaceDetails = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${params.locationId}&fields=name,rating,formatted_phone_number,formatted_address,website,price_level,opening_hours,reviews&key=${GOOGLE_MAPS_API_KEY}`
      )
      const data = await response.json()
      
      if (data.result) {
        setPlaceDetails(data.result)
      } else {
        setError('Failed to fetch place details')
      }
    } catch (error) {
      console.error('Error fetching place details:', error)
      setError('Failed to fetch place details')
    } finally {
      setLoading(false)
    }
  }

  const openWebsite = (url) => {
    Linking.openURL(url)
  }

  const openMaps = () => {
    const address = encodeURIComponent(placeDetails.formatted_address)
    const url = `https://www.google.com/maps/search/?api=1&query=${address}`
    Linking.openURL(url)
  }

  const openPhoneNumber = (number) => {
    Linking.openURL(`tel:${number}`)
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#367AFF" />
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 text-center">{error}</Text>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-backBlue px-4 py-4" contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Header Image */}
      <View className="mt-9 mb-4">
        {params.photoUrl ? (
          <Image
            source={{ uri: params.photoUrl }}
            className="w-full h-72 object-cover rounded-3xl" 
          />
        ) : (
          <View className="w-full h-full bg-gray-300 justify-center items-center">
            <Text className="text-gray-500">No Image Available</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View className=" rouded-t-2xl">
        {/* Name and Rating */}
        <Text className="text-2xl font-bold mb-2">{placeDetails.name}</Text>
        <View className="flex-row items-center mb-4">
          <Ionicons name="star" size={20} color="#FFD700" />
          <Text className="ml-1 text-gray-600">
            {placeDetails.rating} ({placeDetails.reviews?.length || 0} reviews)
          </Text>
        </View>

        {/* Address */}
        <TouchableOpacity 
          onPress={openMaps}
          className="flex-row items-center mb-4"
        >
          <Ionicons name="location" size={20} color="#367AFF" />
          <Text className="ml-2 text-gray-600 flex-1">
            {placeDetails.formatted_address}
          </Text>
        </TouchableOpacity>

        {/* Phone */}
        {placeDetails.formatted_phone_number && (
          <TouchableOpacity 
            onPress={() => openPhoneNumber(placeDetails.formatted_phone_number)}
            className="flex-row items-center mb-4"
          >
            <Ionicons name="call" size={20} color="#367AFF" />
            <Text className="ml-2 text-gray-600">
              {placeDetails.formatted_phone_number}
            </Text>
          </TouchableOpacity>
        )}

        {/* Website */}
        {placeDetails.website && (
          <TouchableOpacity 
            onPress={() => openWebsite(placeDetails.website)}
            className="flex-row items-center mb-4"
          >
            <Ionicons name="globe" size={20} color="#367AFF" />
            <Text className="ml-2 text-blue-500 flex-1" numberOfLines={1}>
              Visit Website
            </Text>
          </TouchableOpacity>
        )}

        {/* Opening Hours */}
        {placeDetails.opening_hours && (
          <View className="mb-4">
            <Text className="text-lg font-bold mb-2">Opening Hours</Text>
            {placeDetails.opening_hours.weekday_text?.map((hours, index) => (
              <Text key={index} className="text-gray-600">{hours}</Text>
            ))}
          </View>
        )}

        {/* Reviews */}
        {placeDetails.reviews && placeDetails.reviews.length > 0 && (
          <View>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-lg font-bold">Reviews</Text>
              <TouchableOpacity 
                onPress={() => {
                  const url = `https://www.google.com/maps/search/?api=1&query=$           {encodeURIComponent(placeDetails.name)}&query_place_id=${params.           locationId}`;
                  Linking.openURL(url);
                }}
                className="flex-row items-center"
              >
                <Text className="text-blue-500 mr-1">View All</Text>
                <Ionicons name="arrow-forward" size={16} color="#367AFF" />
              </TouchableOpacity>
            </View>
            
            {placeDetails.reviews.map((review, index) => (
              <View key={index} className="mb-4 p-3 bg-gray-50 rounded-3xl">
                <View className="flex-row items-center mb-2">
                  <Text className="font-bold text-lg">{review.author_name}</Text>
                  <View className="flex-row items-center ml-2">
                    <Ionicons name="star" size={18} color="#FFD700" />
                    <Text className="ml-1 text-base">{review.rating}</Text>
                  </View>
                </View>
                <Text className="text-gray-600">{review.text}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default PlaceDetails