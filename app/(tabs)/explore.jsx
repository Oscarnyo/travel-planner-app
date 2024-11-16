import { 
  View, 
  Text,
  TouchableWithoutFeedback, 
  Keyboard, 
  TouchableOpacity, 
  ScrollView, 
  RefreshControl,
  Modal 
} from 'react-native'
import React, { useState, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { GOOGLE_MAPS_API_KEY } from '@env'
import CountryList from '../../components/ExploreDetails/CountryList'
import PlaceList from '../../components/ExploreDetails/PlaceList'
import HotelItemList from '../../components/ExploreDetails/HotelItemList'
import RestaurantList from '../../components/ExploreDetails/RestaurantList'
import ChatBot from '../(screens)/chatbot'

const explore = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [chatModalVisible, setChatModalVisible] = useState(false)
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Add your refresh logic here
    // For example, re-fetch data for CountryList, PlaceList, HotelItemList, and RestaurantList
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);
  
  const handlePlaceSelect = (data, details) => {
    if (details) {
      router.push({
        pathname: '/(screens)/PlaceDetails',
        params: {
          locationId: details.place_id,
          name: details.name,
          type: 'place',
          photoUrl: details.photos?.[0] ? 
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${details.photos[0].photo_reference}&key=${GOOGLE_MAPS_API_KEY}` 
            : null
        }
      });
    }
    setIsSearchFocused(false);  
    Keyboard.dismiss();
  };
  
  const ChatModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={chatModalVisible}
      onRequestClose={() => setChatModalVisible(false)}
    >
      <View className="flex-1 bg-black/50">
        <View className="bg-backBlue rounded-t-3xl h-[90%] mt-auto">
          <View className="flex-row justify-between items-center p-4">
            <Text className="text-xl font-bold">Travel Assistant</Text>
            <TouchableOpacity onPress={() => setChatModalVisible(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <ChatBot isModal={true} />
        </View>
      </View>
    </Modal>
  )

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
                onPress={handlePlaceSelect}
                textInputProps={{
                  onFocus: () => setIsSearchFocused(true),
                  onBlur: () => setIsSearchFocused(false),
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
                    zIndex: 1,
                  },
                  textInputContainer: {
                    backgroundColor: 'white',
                    borderRadius: 12,
                  },
                  textInput: {
                    height: 42,
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
                    zIndex: 2,
                  }
                }}
              />
            </View>

            {/* Chat Icon */}
            <TouchableOpacity
              className="bg-white p-3 rounded-xl shadow-sm"
              onPress={() => setChatModalVisible(true)}
            >
              <Ionicons name="chatbubbles" size={22} color="#367AFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView 
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          style={{ marginTop: isSearchFocused ? 230 : 0 }} // Add space when search is focused
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#367AFF"
              colors={["#367AFF"]}
            />
          }
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1">
              <CountryList />
              <PlaceList />
              <HotelItemList />
              <RestaurantList />
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
        <ChatModal />
      </View>
    </SafeAreaView>
  )
}

export default explore