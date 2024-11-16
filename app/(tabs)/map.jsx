import { View, Text, TouchableOpacity, Linking, Image, Alert, ToastAndroid} from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, { Marker, Callout }  from 'react-native-maps'
import * as Location from 'expo-location'
import { Ionicons } from '@expo/vector-icons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_API_KEY } from '@env';

import { Keyboard, TouchableWithoutFeedback } from 'react-native'
import { router } from 'expo-router'
import { addToFavorites, removeFromFavorites, checkPlaceInFavorites, getFavorites } from '../../firebaseConfig';
import { AuthContext } from '../../context/authContext';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const Map = () => {
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [favorites, setFavorites] = useState([]);
  const mapRef = React.useRef(null);
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(collection(db, 'users', user.uid, 'favorites'), (snapshot) => {
        const updatedFavorites = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFavorites(updatedFavorites);
      });
  
      return () => unsubscribe();
    }
  }, [user]);
  
  useEffect(() => {
    console.log('Selected Place:', selectedPlace)
  }, [selectedPlace])
  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        return
      }

      let location = await Location.getCurrentPositionAsync({})
      console.log('Current location:', location)
      setLocation(location)
    })()
  }, [])
  
  const handleToggleFavorite = async (place) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to manage favorites');
      return;
    }
    if (!place || !place.id) {
      console.error('Invalid place object:', place);
      Alert.alert('Error', 'Unable to manage this favorite');
      return;
    }
    try {
      await removeFromFavorites(user.uid, place.id);
      // The favorites list will be automatically updated by the onSnapshot listener
    } catch (error) {
      console.error('Error removing favorite:', error);
      Alert.alert('Error', 'Failed to remove favorite');
    }
  };
  
  const handleMapPress = async (event) => {
    const { coordinate, placeId } = event.nativeEvent;
    console.log('Pressed coordinate:', coordinate, 'Place ID:', placeId);
    
    if (placeId) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,photos&key=${GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
        console.log('API response:', data);
        if (data.result) {
          setSelectedPlace({
            name: data.result.name,
            address: data.result.formatted_address,
            coordinate: {
              latitude: data.result.geometry.location.lat,
              longitude: data.result.geometry.location.lng,
            },
            photoReference: data.result.photos && data.result.photos[0] ? data.result.photos[0].photo_reference : null
          });
        }
      } catch (error) {
        console.error('Error fetching place details:', error);
      }
    } else {
      console.log('No places found at this location')
    }
  };

  const PlaceDetailsCard = ({ place, onToggleFavorite, favorites }) => {
    if (!place) return null;
  
    const [isFavorite, setIsFavorite] = useState(false);
  
    useEffect(() => {
      const favorite = favorites.find(fav => fav.name === place.name);
      setIsFavorite(!!favorite);
      if (favorite) {
        place.id = favorite.id; // Ensure the place object has the correct id
      }
    }, [favorites, place]);
  
    const toggleFavorite = async () => {
      if (isFavorite) {
        await onToggleFavorite(place);
        setIsFavorite(false);
        ToastAndroid.show('Removed from favorites', ToastAndroid.SHORT);
      } else {
        const placeWithId = { ...place, id: place.id || `place_${Date.now()}` };
        await addToFavorites(user.uid, placeWithId);
        setIsFavorite(true);
        ToastAndroid.show('Added to favorites', ToastAndroid.SHORT);
      }
    };
  
    const getPlaceImage = () => {
      if (place.photoReference) {
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photoReference}&key=${GOOGLE_MAPS_API_KEY}`;
      }
      return null;
    };
  
    const openInGoogleMaps = () => {
      const encodedAddress = encodeURIComponent(place.address);
      const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
      Linking.openURL(url);
    };
  
    return (
      <View className="absolute bottom-7 left-4 right-4 bg-white p-4 rounded-[20px] shadow-md h-[130px] flex-row">
        <View className="w-1/3 mr-4">
          {getPlaceImage() ? (
            <Image
              source={{ uri: getPlaceImage() }}
              className="w-full h-full rounded-lg"
            />
          ) : (
            <View className="w-full h-full rounded-lg bg-gray-300 justify-center items-center">
              <Text className="text-gray-500">No Image</Text>
            </View>
          )}
        </View>
        <View className="w-2/3 flex-1 justify-between">
          <View>
            <Text numberOfLines={1} ellipsizeMode="tail" className="text-lg font-bold mb-1">
              {place.name}
            </Text>
            <Text numberOfLines={2} ellipsizeMode="tail" className="text-sm text-gray-600">
              {place.address}
            </Text>
          </View>
          <View className="flex-row justify-end items-center">
            <TouchableOpacity 
              onPress={toggleFavorite}
              className="mr-1 p-2"
            >
              <Ionicons 
                name={isFavorite ? "star" : "star-outline"} 
                size={22} 
                color={isFavorite ? "#FFD700" : "#5d5d5d"} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={openInGoogleMaps}
              className="bg-blue-500 p-2 rounded-full"
            >
              <Ionicons name="map" size={14} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  
  return (
    <SafeAreaView className="flex-1 bg-backBlue">
      <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
      this.googlePlacesAutocomplete?.blur();
    }}>
      <View className="flex-1">
      <GooglePlacesAutocomplete
          placeholder='Search'
          onPress={(data, details = null) => {
          const selectedPlace = {
            name: details.name,
            address: details.formatted_address,
            coordinate: {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
          },
            photoReference: details.photos && details.photos[0] ? details.photos[0].photo_reference : null
          };
          setSelectedPlace(selectedPlace);
          mapRef.current.animateToRegion({
            latitude: selectedPlace.coordinate.latitude,
            longitude: selectedPlace.coordinate.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
            });
          }}
          query={{
          key: GOOGLE_MAPS_API_KEY,
          language: 'en',
          }}
          fetchDetails={true}
          styles={{
            container: {
            position: 'absolute',
            top: 10,
            left: 10,
            right: 10,
            zIndex: 1,
            width: '80%',
          },
          textInputContainer: {
            borderRadius: 12,
          },
          textInput: {
            height: 45,
            color: '#5d5d5d',
            fontSize: 16,
            borderRadius: 12,
            paddingHorizontal: 15,
            paddingRight: 35,
            backgroundColor:'white'
          },
          listView: {
            backgroundColor: '#f6f6f6',
            borderRadius: 12,
            marginTop: 5,
          }
      }}
      
      // Clear button
      renderRightButton={() => (
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 10,
          top: 10,
          zIndex: 2,
        }}
        onPress={() => {
          this.googlePlacesAutocomplete.setAddressText('');
        }}
        >
        <Ionicons name="close-circle" size={24} color="#5d5d5d" />
      </TouchableOpacity>
      )}
    
      ref={(instance) => { this.googlePlacesAutocomplete = instance }}
      />
    
      {/*favorites page button */}
      <TouchableOpacity
        className="absolute right-[10px] top-[10px] z-[2] bg-white rounded-[10px] p-[10px]"
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        onPress={() => {
        // Handle favorite button press
        router.push('/(screens)/favourite');
        }}
        activeOpacity={1}
      >
      <Ionicons name="star" size={24} color="#FFD700" />
      </TouchableOpacity>
    
      {errorMsg ? (
          <Text className="text-red-500 text-center">{errorMsg}</Text>
        ) : location ? (
          <View className="flex-1">
            <MapView
              ref={mapRef}
              className="flex-1"
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              onPress={handleMapPress}
              showsUserLocation={true}
              followsUserLocation={true}
              showsPointsOfInterest={true}
              onPoiClick={(e) => handleMapPress(e)}
            >
              {selectedPlace && (
                <Marker 
                  coordinate={selectedPlace.coordinate}
                  title={selectedPlace.name}
                  description={selectedPlace.address}
                />
              )}
            </MapView>
            
            <PlaceDetailsCard 
            place={selectedPlace} 
            onToggleFavorite={handleToggleFavorite} 
            favorites={favorites} 
            />
            
          </View>
        ) : (
          <Text className="text-center">Loading...</Text>
        )}
      </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

export default Map