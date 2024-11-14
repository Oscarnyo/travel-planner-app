import { View, FlatList, Text } from 'react-native'
import React from 'react'
import CountryItem from './CountryItem'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const CountryList = () => {
  const countries = [
    { id: '1', name: 'Japan' },
    { id: '2', name: 'France' },
    { id: '3', name: 'Italy' },
    { id: '4', name: 'Thailand' },
    { id: '5', name: 'Spain' },
    { id: '6', name: 'Greece' }
  ]

  const handleCountryPress = (country) => {
    router.push({
      pathname: '/(screens)/SearchLocation',
      params: { 
        searchQuery: country.name,
        type: 'tourist_attraction'
      }
    })
  }

  return (
    <View className="mt-4 mb-2 z-0">
      <View className="flex-row items-center mb-3">
        <Ionicons name="earth" size={22} color="#367AFF" />
        <Text className="font-bold text-[20px] ml-2">Popular Destinations</Text>
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={countries}
        renderItem={({ item }) => (
          <CountryItem country={item} />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

export default CountryList