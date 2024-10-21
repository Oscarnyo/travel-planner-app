import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Linking, Alert, ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { AuthContext } from '../../context/authContext';
import { getFavorites, removeFromFavorites } from '../../firebaseConfig';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../../firebaseConfig';



const Favourite = () => {
  const [favorites, setFavorites] = useState([]);
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

  const handleToggleFavorite = async (place) => {
    try {
      await removeFromFavorites(user.uid, place.id);
      // The favorites list will be automatically updated by the onSnapshot listener
    } catch (error) {
      console.error('Error removing favorite:', error);
      Alert.alert('Error', 'Failed to remove favorite');
    }
  };

  const openInGoogleMaps = (address) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    Linking.openURL(url);
  };

  const getPlaceImage = (photoReference) => {
    if (photoReference) {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`;
    }
    return null;
  };

  const renderFavoriteItem = ({ item }) => (
    <ScrollView>
    <View className="bg-white p-4 rounded-[20px] shadow-md mb-4 flex-row">
      <View className="w-1/3 mr-4">
        {getPlaceImage(item.photoReference) ? (
          <Image
            source={{ uri: getPlaceImage(item.photoReference) }}
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
            {item.name}
          </Text>
          <Text numberOfLines={2} ellipsizeMode="tail" className="text-sm text-gray-600">
            {item.address}
          </Text>
        </View>
        <View className="flex-row justify-end items-center">
          <TouchableOpacity 
            onPress={() => handleToggleFavorite(item)}
            className="mr-1 p-2"
          >
            <Ionicons 
              name="star" 
              size={22} 
              color="#FFD700" 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => openInGoogleMaps(item.address)}
            className="bg-blue-500 p-2 rounded-full"
          >
            <Ionicons name="map" size={14} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </ScrollView>
  );

  return (
    <SafeAreaView className="flex-1 bg-backBlue p-4">
        <Text className="text-2xl font-bold mb-4 ml-1">Favorites</Text>
        <FlatList
         data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
    </SafeAreaView>
  );
};

export default Favourite;