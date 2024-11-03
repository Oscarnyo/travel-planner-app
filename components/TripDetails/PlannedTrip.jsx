import { View, Text, Image, TouchableOpacity, Linking} from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { GOOGLE_MAPS_API_KEY } from '@env';
import PlaceCard from './PlaceCard';

const PlannedTrip = ({details, tripDetails}) => {
    // Add debug log
    console.log("PlannedTrip received details:", details);
    
    if (!details || !Array.isArray(details)) {
        console.log("No valid details data");
        return null;
    }
    
    return (
        <View className='mt-8'>
            <View className='flex-row items-center'>
                <Ionicons name="reader" size={22} color="#367AFF" />
                <Text className='font-bold text-[20px]'> Itinerary Plan</Text>
            </View>
            
            {details.map((day, dayIndex) => (
                <View key={`day-${dayIndex}`}>
                    <Text className='font-bold text-[22px] mt-5 ml-[2px]'>
                        {day.day}
                    </Text>
                    {day.activities && day.activities.map((place, placeIndex) => (
                        <View key={`place-${dayIndex}-${placeIndex}`} className='p-[17] rounded-2xl mt-5 bg-[#d2d7f0]'>
                            <PlaceCard
                                place={place}
                                tripId={tripDetails?.docId}
                                dayIndex={dayIndex}
                                placeIndex={placeIndex}
                                tripDetails={details}
                            />
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );
};

export default PlannedTrip