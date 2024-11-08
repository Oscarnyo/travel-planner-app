import { View, Text, Image, TouchableOpacity, Linking, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { GOOGLE_MAPS_API_KEY } from '@env'
import { GetPhotoRef } from '../../services/GooglePlaceApi'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../../firebaseConfig'

const PlaceCard = ({ place, tripId, dayIndex, placeIndex, tripDetails }) => {
    const [photoRef, setPhotoRef] = useState(null)
    
    useEffect(() => {
        GetGooglePhoto()
    }, [place.place_name])
    
    const handleDelete = async () => {
        Alert.alert(
            "Delete Place",
            "Are you sure you want to delete this place from your itinerary?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            const updatedDailyPlan = [...tripDetails];
                            updatedDailyPlan[dayIndex].activities.splice(placeIndex, 1);
                            
                            const tripRef = doc(db, "users", tripId);
                            const currentData = await getDoc(tripRef);
                            const tripData = currentData.data();
                            
                            await updateDoc(tripRef, {
                                tripPlan: {
                                    ...tripData.tripPlan,
                                    daily_plan: updatedDailyPlan
                                }
                            });
                            
                            // No need to manually update state as onSnapshot will handle it
                            
                        } catch (error) {
                            console.error("Error deleting place:", error);
                            Alert.alert("Error", "Failed to delete place");
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    }
    
    const GetGooglePhoto = async () => {
        try {
            const result = await GetPhotoRef(place.place_name)
            setPhotoRef(result)
        } catch (error) {
            console.error('Error fetching photo:', error)
        }
    }
    
    const openInGoogleMaps = (placeName) => {
        const encodedPlace = encodeURIComponent(placeName);
        const url = `https://www.google.com/maps/search/?api=1&query=${encodedPlace}`;
        Linking.openURL(url).catch(err => console.error('Error opening maps:', err));
    };
    
    return (
        <View>
            {photoRef ? (
                <Image
                    className='w-full h-[180] rounded-2xl'
                    source={{
                        uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${GOOGLE_MAPS_API_KEY}`
                    }}
                />
            ) : (
                <View className='w-full h-[180] rounded-2xl bg-gray-300 justify-center items-center'>
                    <Text className='text-gray-500 text-lg'>No Image</Text>
                </View>
            )}
            
            <View className='mt-2 '>
                <View className='flex-row items-center'>
                    <Text className='font-bold text-[20px] mb-1'>
                        {place.place_name}
                    </Text>
                    <TouchableOpacity 
                        className='ml-2 mb-[2px]'
                        onPress={handleDelete}
                    >
                        <Ionicons name="trash-outline" size={17} color="#FF3B30" />
                    </TouchableOpacity>
                </View>
                
                <Text className='font-normal text-[14px] text-gray-500 mb-2'>
                    {place.place_details}
                </Text>
                
                <View className='flex-row justify-between items-center'>
                        <Text className='font-normal text-[15px] mb-1 mt-1'>
                            🎟️ Ticket Price: 
                            <Text className='font-bold'> {place.ticket_pricing}</Text>
                        </Text>
                    
                    <TouchableOpacity 
                        className='bg-secondary p-[6] rounded-lg'
                        onPress={() => openInGoogleMaps(place.place_name)}
                    >
                        <Ionicons name="navigate" size={20} color="#E5E8F8" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default PlaceCard