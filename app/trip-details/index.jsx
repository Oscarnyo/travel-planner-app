import { View, Text, ActivityIndicator, ScrollView, Image } from 'react-native'
import React, {useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router';
import { GOOGLE_MAPS_API_KEY } from '@env';
import moment from 'moment';
import FlightInfo from '../../components/TripDetails/FlightInfo';
import HotelList from '../../components/TripDetails/HotelList';
import Ionicons from '@expo/vector-icons/Ionicons';
import PlannedTrip from '../../components/TripDetails/PlannedTrip';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const TripsDetails = () => {
    const {trip} = useLocalSearchParams();
    const [tripDetails, setTripDetails] = useState(null);
    
    
    const formatData = (data) => {
        try {
            return JSON.parse(data);
        } catch (error) {
            console.error('Error parsing data:', error);
            return null;
        }
    }
    
    useEffect(() => {
        if (trip) {
            try {
                const parsedTrip = JSON.parse(trip);
                setTripDetails({
                    ...parsedTrip,
                    docId: parsedTrip.docId || null
                });
                
                // Set up real-time listener
                const tripRef = doc(db, "users", parsedTrip.docId);
                const unsubscribe = onSnapshot(tripRef, (doc) => {
                    if (doc.exists()) {
                        setTripDetails({
                            ...doc.data(),
                            docId: doc.id
                        });
                    }
                });
                
                return () => unsubscribe();
            } catch (error) {
                console.error('Error parsing trip:', error);
            }
        }
    }, [trip]);
    
    // Add this debug log
    useEffect(() => {
        if (tripDetails) {
            console.log("Itinerary Data:", tripDetails?.tripPlan?.itinerary);
        }
    }, [tripDetails]);
    
    if (!tripDetails) {
        return (
            <SafeAreaView className="bg-backBlue flex-1">
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }
    
    return tripDetails&&(
        <SafeAreaView className="bg-backBlue flex-1">
            <ScrollView contentContainerStyle={{ paddingBottom: 50 }} showsVerticalScrollIndicator = {false} > 
                <View>
                    <Image 
                    source={{
                        uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${formatData(tripDetails.tripData).locationInfo?.photoRef}&key=${GOOGLE_MAPS_API_KEY}`
                        }}
                        className='w-full h-[300]'
                        />
                    
                    <View className='p-4 h-full mt-[-30] rounded-t-[35px] bg-backBlue'>
                        <Text className='text-[25px] font-bold'>
                            {tripDetails?.tripPlan?.location}
                        </Text>
                        
                        <View className='flex-row ml-[1px] mt-1'>
                            <View className='flex-row items-center'>
                                <Ionicons name="calendar" size={18} color="#367AFF" />
                                <Text className='font-normal text-[18px] text-gray-500'>
                                        {" "+moment(formatData(tripDetails.tripData).startDate).format('DD MMM yyyy')}  -
                                    <Text className='font-normal text-[18px] text-gray-500'>
                                        {"  "+ moment(formatData(tripDetails.tripData).endDate).format('DD MMM yyyy')}
                                    </Text>
                                </Text>
                            </View>
                        </View>
                        
                        <View className='flex-row items-center'>
                            <Ionicons name="people-sharp" size={18} color="#367AFF" />
                            <Text className='font-normal text-[18px] text-gray-500 ml-[2px]'>
                                {" "+formatData(tripDetails.tripData)?.     traveler?.title}
                            </Text>
                        </View>
                        
                        {/* Flight Ingfo */}
                        {/* <FlightInfo flightData={tripDetails?.tripPlan?.flight_details}/> */}
                    
                    
                        {/* Hotels list */}
                        <HotelList hotelList={tripDetails?.tripPlan?.hotel_options}/>
                    
                        {/* Itinerary plan */}
                        {tripDetails?.tripPlan?.daily_plan && Array.isArray(tripDetails.tripPlan.daily_plan) && (
                        <PlannedTrip 
                            details={tripDetails.tripPlan.daily_plan}
                            tripDetails={tripDetails}
                        />
                        )}
                        
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default TripsDetails