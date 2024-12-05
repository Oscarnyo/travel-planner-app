import { View, Text, FlatList } from 'react-native'
import React, { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react'
import * as Location from 'expo-location'
import { GOOGLE_MAPS_API_KEY } from '@env'
import PlaceItem from './PlaceItem'
import { Ionicons } from '@expo/vector-icons'

const PlaceList = forwardRef((props, ref) => {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Expose the fetch method via ref
  useImperativeHandle(ref, () => ({
    fetchNearbyPlaces
  }));

  useEffect(() => {
    fetchNearbyPlaces()
  }, [])

  const fetchNearbyPlaces = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.error('Location permission denied')
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      const { latitude, longitude } = location.coords

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=tourist_attraction&key=${GOOGLE_MAPS_API_KEY}`
      )
      const data = await response.json()
      
      if (data.results) {
        setPlaces(data.results)
      }
    } catch (error) {
      console.error('Error fetching nearby places:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Text className="text-center mt-4">Loading places...</Text>
  }

  return (
    <View className="mt-4">
      <View className="flex-row items-center mb-4 ">
        <Ionicons name="location" size={22} color="#367AFF" />
        <Text className="font-bold text-[20px]"> Nearby Places</Text>
      </View>
      
      <FlatList 
        data={places}
        renderItem={({ item }) => <PlaceItem place={item} />}
        keyExtractor={(item) => item.place_id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
      />
    </View>
  )
});

export default PlaceList