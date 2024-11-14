import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as Location from 'expo-location'
import RestaurantItem from './RestaurantItem'
import { Ionicons } from '@expo/vector-icons'
import { GOOGLE_MAPS_API_KEY } from '@env'

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchNearbyRestaurants()
  }, [])

  const fetchNearbyRestaurants = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setError('Location permission denied')
        setLoading(false)
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      const { latitude, longitude } = location.coords

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=restaurant&key=${GOOGLE_MAPS_API_KEY}`
      )
      const data = await response.json()
      
      if (data.results) {
        const validRestaurants = data.results.filter(restaurant => 
          restaurant.name && 
          restaurant.place_id &&
          restaurant.business_status === "OPERATIONAL"
        ).slice(0, 20) // Limit to 5 restaurants
        
        if (validRestaurants.length === 0) {
          setError('No restaurants found in this area')
        } else {
          setRestaurants(validRestaurants)
        }
      } else {
        setError('Failed to fetch restaurants')
      }
    } catch (error) {
      console.error('Error in fetchNearbyRestaurants:', error)
      setError('Failed to fetch restaurants')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View className="mt-4">
        <View className="flex-row items-center mb-4">
          <Ionicons name="restaurant" size={22} color="#367AFF" />
          <Text className="font-bold text-[20px] ml-2">Nearby Restaurants</Text>
        </View>
        <ActivityIndicator size="large" color="#367AFF" />
      </View>
    )
  }

  if (error) {
    return (
      <View className="mt-4">
        <View className="flex-row items-center mb-4">
          <Ionicons name="restaurant" size={22} color="#367AFF" />
          <Text className="font-bold text-[20px] ml-2">Nearby Restaurants</Text>
        </View>
        <Text className="text-red-500 text-center">{error}</Text>
      </View>
    )
  }

  return (
    <View className="mt-4">
      <View className="flex-row items-center mb-4">
        <Ionicons name="restaurant" size={22} color="#367AFF" />
        <Text className="font-bold text-[20px] ml-2">Nearby Restaurants</Text>
      </View>
      
      <FlatList 
        data={restaurants}
        renderItem={({ item }) => (
          <RestaurantItem 
            restaurant={{
              name: item.name,
              location_id: item.place_id,
              rating: item.rating,
              num_reviews: item.user_ratings_total,
              price_level: item.price_level,
              photo: {
                images: {
                  medium: {
                    url: item.photos?.[0] ? 
                      `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photos[0].photo_reference}&key=${GOOGLE_MAPS_API_KEY}` 
                      : null
                  }
                }
              }
            }} 
          />
        )}
        keyExtractor={(item) => item.place_id}
        scrollEnabled={false}
      />
    </View>
  )
}

export default RestaurantList