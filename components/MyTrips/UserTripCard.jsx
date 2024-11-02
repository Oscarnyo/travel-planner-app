import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import moment from 'moment'
import { GOOGLE_MAPS_API_KEY } from '@env'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../firebaseConfig'

const UserTripCard = ({trip, onDelete}) => {
    const formatData = (data) => {
        return JSON.parse(data)
    }
    
    const handleDelete = async () => {
        Alert.alert(
            "Delete Trip",
            "Are you sure you want to delete this trip?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, "users", trip.docId));
                            onDelete && onDelete(trip.docId);
                        } catch (error) {
                            console.error("Error deleting trip:", error);
                            Alert.alert("Error", "Failed to delete trip");
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    }
    
    return (
        <TouchableOpacity 
            onPress={() => router.push({
                pathname: '/trip-details',
                params: {
                    trip: JSON.stringify(trip)
                }
            })}
            activeOpacity={0.7}
        >
            <View className='mt-3 mb-2 flex-row py-4 px-4 items-center bg-[#d2d7f0] rounded-2xl relative'>
                <Image 
                    source={{
                        uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + 
                             formatData(trip.tripData).locationInfo.photoRef + 
                             '&key=' + GOOGLE_MAPS_API_KEY
                    }}
                    className='w-[100] h-[100] rounded-xl'
                />
                
                <View className='ml-3'>
                    <Text className='font-medium text-[18px] mb-1 w-[300px]'>
                        {trip.tripPlan?.location}
                    </Text>
                    
                    <View className='flex-row items-center mb-1'>
                        <Ionicons name="calendar" size={16} color="#367AFF" />
                        <Text className='font-normal text-[14px] text-gray-500'>
                            {" " + moment(formatData(trip.tripData).startDate).format('DD MMM yyyy')}
                        </Text>
                    </View>
                    <View className='flex-row items-center'>
                        <Ionicons name="people-sharp" size={16} color="#367AFF" />
                        <Text className='font-normal text-[14px] text-gray-500'>
                            {" " + formatData(trip.tripData).traveler.title}
                        </Text>
                    </View>
                </View>
                
                <TouchableOpacity 
                    className='absolute bottom-3 right-2 p-2'
                    onPress={handleDelete}
                >
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

export default UserTripCard