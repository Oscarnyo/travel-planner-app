import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView from 'react-native-maps'
import * as Location from 'expo-location'

const Map = () => {
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        return
      }

      let location = await Location.getCurrentPositionAsync({})
      setLocation(location)
    })()
  }, [])

  return (
    <SafeAreaView className="flex-1 bg-backBlue">
      <View className="flex-1">
        {errorMsg ? (
          <Text className="text-red-500 text-center">{errorMsg}</Text>
        ) : location ? (
          <MapView
            className="w-full h-full"
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        ) : (
          <Text className="text-center">Loading...</Text>
        )}
      </View>
    </SafeAreaView>
  )
}

export default Map