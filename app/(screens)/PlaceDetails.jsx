import { View, Text, Image, SafeAreaView, ActivityIndicator, ScrollView, Linking, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { getLocationDetails } from '../../services/TravelAdvisorApi'
import { Ionicons } from '@expo/vector-icons'

const PlaceDetails = () => {
  const params = useLocalSearchParams()
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDetails()
  }, [])

  const fetchDetails = async () => {
    try {
      const response = await getLocationDetails(params.locationId)
      console.log('Hotel Details Response:', response) // Debug log
      if (response?.data) {
        setDetails(response.data[0]) // Access the first item in the data array
      }
    } catch (error) {
      console.error('Error fetching details:', error)
    } finally {
      setLoading(false)
    }
  }

  const openInMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(params.name)}`
    Linking.openURL(url)
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#367AFF" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-backBlue">
      <ScrollView>
        {/* Hotel Image */}
        <Image
          source={{ uri: params.photoUrl || details?.photo?.images?.large?.url }}
          className="w-full h-[250]"
          
        />

        {/* Hotel Details */}
        <View className="p-4">
          <Text className="text-2xl font-bold mb-2">{params.name}</Text>
          
          {/* Rating and Reviews */}
          {(details?.rating || details?.num_reviews) && (
            <View className="flex-row items-center mb-4">
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text className="ml-2 text-gray-700">
                {details?.rating || 'N/A'} ({details?.num_reviews || 0} reviews)
              </Text>
            </View>
          )}

          {/* Address */}
          {details?.location_string && (
            <TouchableOpacity onPress={openInMaps} className="flex-row items-start mb-4">
              <Ionicons name="location" size={20} color="#367AFF" />
              <Text className="ml-2 text-gray-700 flex-1">
                {details.location_string}
              </Text>
            </TouchableOpacity>
          )}

          {/* Price */}
          {details?.price && (
            <View className="flex-row items-center mb-4">
              <Ionicons name="cash" size={20} color="#367AFF" />
              <Text className="ml-2 text-gray-700">
                {details.price}
              </Text>
            </View>
          )}

          {/* Hotel Class */}
          {details?.hotel_class && (
            <View className="flex-row items-center mb-4">
              <Ionicons name="star" size={20} color="#367AFF" />
              <Text className="ml-2 text-gray-700">
                {details.hotel_class} Stars
              </Text>
            </View>
          )}

          {/* Awards */}
          {details?.awards && details.awards.length > 0 && (
            <View className="mb-4">
              <Text className="text-lg font-bold mb-2">Awards</Text>
              <View className="flex-row flex-wrap">
                {details.awards.map((award, index) => (
                  <View key={index} className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2">
                    <Text className="text-gray-700">{award.display_name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Description */}
          {details?.description && (
            <View className="mb-4">
              <Text className="text-lg font-bold mb-2">About</Text>
              <Text className="text-gray-700">{details.description}</Text>
            </View>
          )}

          {/* Contact */}
          {details?.phone && (
            <TouchableOpacity 
              onPress={() => Linking.openURL(`tel:${details.phone}`)}
              className="flex-row items-center mb-4"
            >
              <Ionicons name="call" size={20} color="#367AFF" />
              <Text className="ml-2 text-gray-700">{details.phone}</Text>
            </TouchableOpacity>
          )}

          {/* Website */}
          {details?.web_url && (
            <TouchableOpacity 
              onPress={() => Linking.openURL(details.web_url)}
              className="flex-row items-center mb-4"
            >
              <Ionicons name="globe" size={20} color="#367AFF" />
              <Text className="ml-2 text-blue-500">Visit Website</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default PlaceDetails