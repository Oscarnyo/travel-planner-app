import { View, Text, Image, ScrollView, TouchableOpacity, Linking, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { GOOGLE_MAPS_API_KEY } from '@env'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

const CountryDetails = () => {
  const params = useLocalSearchParams()
  const [attractions, setAttractions] = useState([])
  const [loading, setLoading] = useState(true)
  const [countryInfo, setCountryInfo] = useState(null)
  const [wikiDescription, setWikiDescription] = useState('');

  useEffect(() => {
    fetchCountryInfo()
    fetchPopularAttractions()
    fetchWikiDescription();
  }, [])
  
  const fetchWikiDescription = async () => {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${params.name}`
      );
      const data = await response.json();
      setWikiDescription(data.extract);
    } catch (error) {
      console.error('Error fetching wiki description:', error);
    }
  };

  const fetchCountryInfo = async () => {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${params.name}`)
      const data = await response.json()
      if (data[0]) {
        setCountryInfo(data[0])
      }
    } catch (error) {
      console.error('Error fetching country info:', error)
    }
  }
  
  const renderAboutSection = () => (
    <View className="mb-6">
      <Text className="text-xl font-bold mb-4">About</Text>
      <View className="bg-white rounded-2xl p-4 shadow-sm">
        {/* Languages */}
        <View className="mb-3">
          <Text className="font-bold text-gray-800 mb-1">Languages</Text>
          <Text className="text-gray-600">
            {formatLanguages(countryInfo?.languages)}
          </Text>
        </View>

        {/* Currencies */}
        <View className="mb-3">
          <Text className="font-bold text-gray-800 mb-1">Currencies</Text>
          <Text className="text-gray-600">
            {formatCurrencies(countryInfo?.currencies)}
          </Text>
        </View>

        {/* Time Zones */}
        <View className="mb-3">
          <Text className="font-bold text-gray-800 mb-1">Time Zones</Text>
          <Text className="text-gray-600">
            {countryInfo?.timezones?.join(', ') || 'N/A'}
          </Text>
        </View>

        {/* Driving Side */}
        <View className="mb-3">
          <Text className="font-bold text-gray-800 mb-1">Driving Side</Text>
          <Text className="text-gray-600 capitalize">
            {countryInfo?.car?.side || 'N/A'}
          </Text>
        </View>

        {/* Additional Info */}
        <View>
          <Text className="font-bold text-gray-800 mb-1">Additional Info</Text>
          <View className="flex-row flex-wrap">
            <View className="flex-row items-center mr-4 mb-2">
              <Ionicons name="call" size={16} color="#367AFF" />
              <Text className="ml-1 text-gray-600">
                Calling Code: +{countryInfo?.idd?.root}{countryInfo?.idd?.suffixes?.[0]}
              </Text>
            </View>
            <View className="flex-row items-center mb-2">
              <Ionicons name="globe-outline" size={16} color="#367AFF" />
              <Text className="ml-1 text-gray-600">
                Domain: {countryInfo?.tld?.[0]}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const fetchPopularAttractions = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=tourist+attractions+in+${params.name}&key=${GOOGLE_MAPS_API_KEY}`
      )
      const data = await response.json()
      if (data.results) {
        setAttractions(data.results.slice(0, 10))
      }
    } catch (error) {
      console.error('Error fetching attractions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAttractionPress = (place) => {
    router.push({
      pathname: '/(screens)/PlaceDetails',
      params: { 
        locationId: place.place_id,
        photoUrl: place.photos?.[0]?.photo_reference ? 
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_MAPS_API_KEY}` 
          : null
      }
    });
  };
  
  const formatLanguages = (languages) => {
    if (!languages) return 'N/A';
    return Object.values(languages).join(', ');
  };

  const formatCurrencies = (currencies) => {
    if (!currencies) return 'N/A';
    return Object.values(currencies)
      .map(currency => `${currency.name} (${currency.symbol})`)
      .join(', ');
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#367AFF" />
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-backBlue p-4">
      <ScrollView className="flex-1">
        {/* Header Image */}
        <View className="h-[300]">
          {params.photoUrl ? (
            <Image
              source={{ uri: params.photoUrl }}
              className="w-full h-full rounded-2xl"
            />
          ) : (
            <View className="w-full h-full bg-gray-300 justify-center items-center">
              <Text className="text-gray-500">No Image Available</Text>
            </View>
          )}
        </View>

        <View className="mt-4">
          {/* Country Basic Info */}
          <Text className="text-2xl font-bold mb-2">{params.name}</Text>
          {countryInfo && (
            <View className="mb-6">
              <View className="flex-row items-center mb-2">
                <Ionicons name="location" size={20} color="#367AFF" />
                <Text className="ml-2 text-gray-600">Capital: {countryInfo.capital?.[0]}</Text>
              </View>
              <View className="flex-row items-center mb-2">
                <Ionicons name="people" size={20} color="#367AFF" />
                <Text className="ml-2 text-gray-600">
                  Population: {countryInfo.population?.toLocaleString()}
                </Text>
              </View>
              <View className="flex-row items-center mb-2">
                <Ionicons name="globe" size={20} color="#367AFF" />
                <Text className="ml-2 text-gray-600">
                  Region: {countryInfo.region}
                </Text>
              </View>
            </View>
          )}
          
          {/* About Section */}
          {wikiDescription && (
            <View className="mb-3">
                <Text className="font-bold text-gray-800 mb-1">Description</Text>
                <Text className="text-gray-600">
                {wikiDescription}
                </Text>
            </View>
            )}
            
          {countryInfo && renderAboutSection()}

          {/* Popular Attractions */}
          <Text className="text-xl font-bold mb-4">Popular Attractions</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            {attractions.map((place, index) => (
            <TouchableOpacity 
                key={place.place_id}
                onPress={() => handleAttractionPress(place)}
                className="mr-4"
            >
                <View className="w-[200] bg-white rounded-2xl shadow-sm">
                  {place.photos?.[0]?.photo_reference ? (
                    <Image
                      source={{
                        uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_MAPS_API_KEY}`
                      }}
                      className="w-full h-[140] rounded-t-2xl"
                    />
                  ) : (
                    <View className="w-full h-[140] rounded-t-2xl bg-gray-300 justify-center items-center">
                      <Text className="text-gray-500">No Image</Text>
                    </View>
                  )}
                  <View className="p-3">
                    <Text className="font-bold text-[16px] mb-1" numberOfLines={1}>
                      {place.name}
                    </Text>
                    {place.rating && (
                      <View className="flex-row items-center">
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text className="ml-1 text-gray-600">
                          {place.rating} ({place.user_ratings_total} reviews)
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CountryDetails