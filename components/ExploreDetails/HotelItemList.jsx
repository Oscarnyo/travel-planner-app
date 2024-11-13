import { View, Text, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as Location from 'expo-location'
import HotelItem from './HotelItem'
import { Ionicons } from '@expo/vector-icons'
import { searchNearbyHotels } from '../../services/TravelAdvisorApi'

const HotelItemList = () => {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

      const response = await searchNearbyHotels(latitude, longitude)
      console.log('Nearby hotels response:', response) // Debug log

      if (response?.data) {
        // Filter out hotels without necessary data
        const validHotels = response.data.filter(hotel => 
          hotel.name && hotel.location_id
        )
        setHotels(validHotels)
      } else {
        setError('No hotels found')
      }
    } catch (error) {
      console.error('Error fetching nearby hotels:', error)
      setError('Failed to fetch hotels')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Text className="text-center mt-4">Loading hotels...</Text>
  }

  if (error) {
    return <Text className="text-center mt-4 text-red-500">{error}</Text>
  }

  if (hotels.length === 0) {
    return <Text className="text-center mt-4">No hotels found nearby</Text>
  }

  return (
    <View className="mt-1">
      <View className="flex-row items-center mb-4">
        <Ionicons name="bed" size={22} color="#367AFF" />
        <Text className="font-bold text-[20px] ml-2">Nearby Hotels</Text>
      </View>
      
      <FlatList 
        data={hotels}
        renderItem={({ item }) => <HotelItem hotel={item} />}
        keyExtractor={(item) => item.location_id.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
      />
    </View>
  )
}

export default HotelItemList