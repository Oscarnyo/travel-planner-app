import { TouchableOpacity, Text, View, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GOOGLE_MAPS_API_KEY } from '@env'
import { router } from 'expo-router'

const CountryItem = ({ country }) => {
  const [placeDetails, setPlaceDetails] = useState(null)
  const [photoRef, setPhotoRef] = useState(null)

  useEffect(() => {
    fetchCountryDetails()
  }, [])

  const fetchCountryDetails = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${country.name}&inputtype=textquery&fields=place_id,photos&key=${GOOGLE_MAPS_API_KEY}`
      )
      const data = await response.json()
      if (data.candidates && data.candidates[0]) {
        setPlaceDetails(data.candidates[0])
        if (data.candidates[0].photos) {
          setPhotoRef(data.candidates[0].photos[0].photo_reference)
        }
      }
    } catch (error) {
      console.error('Error fetching country details:', error)
    }
  }

  const handlePress = async () => {
    try {
      router.push({
        pathname: '/(screens)/CountryDetails',
        params: { 
          name: country.name,
          photoUrl: photoRef ? 
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${GOOGLE_MAPS_API_KEY}` 
            : null
        }
      });
    } catch (error) {
      console.error('Error navigating to country details:', error);
      Alert.alert('Error', 'Failed to load country details');
    }
  };

  return (
    <TouchableOpacity 
      className="mr-4 items-center"
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View 
        className="rounded-xl overflow-hidden shadow-sm"
        style={{
          width: 150,
          height: 200,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        {photoRef ? (
          <Image
            source={{
              uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${GOOGLE_MAPS_API_KEY}`
            }}
            className="w-full h-full"
          />
        ) : (
          <View className="w-full h-full bg-gray-300 justify-center items-center">
            <Text className="text-gray-500">Loading...</Text>
          </View>
        )}
        <View className="absolute bottom-0 w-full bg-black/50 p-2">
          <Text className="text-white font-bold text-center">{country.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default CountryItem