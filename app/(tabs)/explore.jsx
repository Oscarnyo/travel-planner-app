import { View, TouchableWithoutFeedback, Keyboard, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { GOOGLE_MAPS_API_KEY } from '@env'
import CountryList from '../../components/ExploreDetails/CountryList'
import PlaceList from '../../components/ExploreDetails/PlaceList'
import HotelItemList from '../../components/ExploreDetails/HotelItemList'

const explore = () => {
  return (
    <SafeAreaView className="flex-1 bg-backBlue">
      <View className="flex-1">
        {/* Fixed Header */}
        <View className="px-4 pt-4 bg-backBlue">
          <View className="flex-row items-center justify-between">
            {/* Search Bar */}
            <View className="flex-1 mr-4">
              <GooglePlacesAutocomplete
                placeholder='Search places...'
                onPress={(data, details = null) => {
                  console.log('Search result:', data, details);
                  router.push({
                    pathname: '/(screens)/SearchLocation',
                    params: { 
                      placeId: details?.place_id,
                      placeName: data.description
                    }
                  });
                }}
                query={{
                  key: GOOGLE_MAPS_API_KEY,
                  language: 'en',
                }}
                fetchDetails={true}
                enablePoweredByContainer={false}
                styles={{
                  container: {
                    flex: 1,
                  },
                  textInputContainer: {
                    backgroundColor: 'white',
                    borderRadius: 12,
                  },
                  textInput: {
                    height: 43,
                    color: '#5d5d5d',
                    fontSize: 16,
                    backgroundColor: 'transparent',
                  },
                  listView: {
                    backgroundColor: 'white',
                    borderRadius: 12,
                    marginTop: 10,
                    elevation: 3,
                    position: 'absolute',
                    top: 45,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                  }
                }}
              />
            </View>

            {/* Chat Icon */}
            <TouchableOpacity
              className="bg-white p-3 rounded-xl shadow-sm"
              onPress={() => {
                console.log('Chat pressed')
              }}
            >
              <Ionicons name="chatbubbles" size={22} color="#367AFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView 
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1">
              {/* Category List */}
              <CountryList />
              
              {/* Place List */}
              <PlaceList />
              
              {/* Hotel List */}
              <HotelItemList />
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default explore