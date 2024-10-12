import { View, Text, TouchableOpacity, Linking } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, { Marker, Callout }  from 'react-native-maps'
import * as Location from 'expo-location'
import { Ionicons } from '@expo/vector-icons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_API_KEY } from '@env';

const Map = () => {
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const mapRef = React.useRef(null);

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

  const handleMapPress = async (event) => {
    const { coordinate, placeId } = event.nativeEvent;
    console.log('Pressed coordinate:', coordinate, 'Place ID:', placeId);
    
    if (placeId) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry&key=${GOOGLE_MAPS_API_KEY}`
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
            }
          });
        }
      } catch (error) {
        console.error('Error fetching place details:', error);
      }
    } else {
      // Handle custom marker or map press without a placeId
      // ... (keep the existing code for this case)
      console.log('No places found at this location')
    }
  };

  const PlaceDetailsCard = ({ place }) => {
    if (!place) return null;
  
    const openInGoogleMaps = () => {
      const url = `https://www.google.com/maps/search/?api=1&query=${place.coordinate.latitude},${place.coordinate.longitude}`;
      Linking.openURL(url);
    };
  
    return (
      <View className="absolute bottom-7 left-4 right-4 bg-white p-4 rounded-lg shadow-md h-[130px]">
        <Text className="text-lg font-bold mb-2">{place.name}</Text>
        <Text className="text-sm text-gray-600 mb-2">{place.address}</Text>
        <TouchableOpacity 
          onPress={openInGoogleMaps}
          className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full"
        >
          <Ionicons name="map" size={15} color="white" />
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <SafeAreaView className="flex-1">
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
              }
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
            },
            textInputContainer: {
              backgroundColor: '#f6f6f6',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#ddd',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            },
            textInput: {
              height: 45,
              color: '#5d5d5d',
              fontSize: 16,
              borderRadius: 25,
              paddingHorizontal: 15,
            },
            listView: {
              backgroundColor: 'white',
              borderRadius: 10,
              marginTop: 5,
            },
          }}
        />
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
            <PlaceDetailsCard place={selectedPlace} />
          </View>
        ) : (
          <Text className="text-center">Loading...</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

export default Map