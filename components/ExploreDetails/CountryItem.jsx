import { TouchableOpacity, Text, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GOOGLE_MAPS_API_KEY } from '@env'

const CountryItem = ({ country, onPress }) => {
  const [photoRef, setPhotoRef] = useState(null)

  useEffect(() => {
    fetchCountryPhoto()
  }, [])

  const fetchCountryPhoto = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${country.name}&inputtype=textquery&fields=photos&key=${GOOGLE_MAPS_API_KEY}`
      )
      const data = await response.json()
      if (data.candidates && data.candidates[0]?.photos) {
        setPhotoRef(data.candidates[0].photos[0].photo_reference)
      }
    } catch (error) {
      console.error('Error fetching country photo:', error)
    }
  }

  return (
    <TouchableOpacity 
      className="mr-4 items-center"
      onPress={() => onPress(country)}
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