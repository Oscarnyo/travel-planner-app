import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import * as Location from 'expo-location'
import HotelItem from './HotelItem'
import { Ionicons } from '@expo/vector-icons'
import { GOOGLE_MAPS_API_KEY } from '@env'


const HotelItemList = forwardRef((props, ref) => {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useImperativeHandle(ref, () => ({
    fetchNearbyHotels
  }));


  useEffect(() => {
    fetchNearbyHotels()
  }, [])

  const fetchNearbyHotels = async () => {
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
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=lodging&key=${GOOGLE_MAPS_API_KEY}`
      )
      const data = await response.json()
      
      if (data.results) {
        const validHotels = data.results.filter(hotel => 
          hotel.name && 
          hotel.place_id &&
          hotel.business_status === "OPERATIONAL"
        )
        
        if (validHotels.length === 0) {
          setError('No hotels found in this area')
        } else {
          setHotels(validHotels)
        }
      } else {
        setError('Failed to fetch hotels')
      }
    } catch (error) {
      console.error('Error in fetchNearbyHotels:', error)
      setError('Failed to fetch hotels')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View className="mt-4">
        <View className="flex-row items-center mb-4">
          <Ionicons name="bed" size={22} color="#367AFF" />
          <Text className="font-bold text-[20px] ml-2">Nearby Hotels</Text>
        </View>
        <ActivityIndicator size="large" color="#367AFF" />
      </View>
    )
  }

  if (error) {
    return (
      <View className="mt-4">
        <View className="flex-row items-center mb-4">
          <Ionicons name="bed" size={22} color="#367AFF" />
          <Text className="font-bold text-[20px] ml-2">Nearby Hotels</Text>
        </View>
        <Text className="text-red-500 text-center">{error}</Text>
      </View>
    )
  }

  return (
    <View className="mt-2">
      <View className="flex-row items-center mb-4">
        <Ionicons name="bed" size={22} color="#367AFF" />
        <Text className="font-bold text-[20px] ml-2">Nearby Hotels</Text>
      </View>
      
      <FlatList 
        data={hotels}
        renderItem={({ item }) => (
          <HotelItem 
            hotel={{
              name: item.name,
              location_id: item.place_id,
              rating: item.rating,
              num_reviews: item.user_ratings_total,
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
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
      />
    </View>
  )
});

export default HotelItemList