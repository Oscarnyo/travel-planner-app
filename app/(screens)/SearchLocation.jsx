import { View, Text, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { GOOGLE_MAPS_API_KEY } from '@env'
import { router, useLocalSearchParams } from 'expo-router'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebaseConfig'

const SearchLocation = () => {
    const { tripId, dayIndex, insertPosition } = useLocalSearchParams();

    const handlePlaceSelection = async (data, details) => {
        try {
            if (!tripId || dayIndex === undefined) {
                console.error('Missing tripId or dayIndex');
                return;
            }
    
            // Get current trip data from "users" collection
            const tripRef = doc(db, "users", tripId);
            const tripDoc = await getDoc(tripRef);
            
            if (!tripDoc.exists()) {
                throw new Error('Trip document not found');
            }
    
            const tripData = tripDoc.data();
            
            // Create new place object
            const newPlace = {
                place_name: details.name || "Unknown Place",
                place_details: details.editorial_summary?.overview || details.formatted_address || "No description available",
                opening_hours: details.current_opening_hours?.weekday_text || [],
                ticket_pricing: "Price not available",
                is_open: details.current_opening_hours?.open_now || false,
                photoRef: details.photos?.[0]?.photo_reference || null,
                isManuallyAdded: true
            };
    
            // Get the current daily plan or initialize it
            let updatedTripPlan = tripData.tripPlan || {};
            let updatedDailyPlan = updatedTripPlan.daily_plan || [];
    
            // Ensure the day exists
            if (!updatedDailyPlan[dayIndex]) {
                updatedDailyPlan[dayIndex] = {
                    day: `Day ${parseInt(dayIndex) + 1}`,
                    activities: []
                };
            }
    
            // Ensure activities array exists
            if (!updatedDailyPlan[dayIndex].activities) {
                updatedDailyPlan[dayIndex].activities = [];
            }
            
            // Insert the new place at the specified position
            if (insertPosition === 'start') {
                updatedDailyPlan[dayIndex].activities.unshift(newPlace);
            } else {
                const position = parseInt(insertPosition);
                updatedDailyPlan[dayIndex].activities.splice(position, 0, newPlace);
            }
    
            // Remove the duplicate push operation
            // updatedDailyPlan[dayIndex].activities.push(newPlace); // Remove this line
    
            // Update the entire tripPlan object
            await updateDoc(tripRef, {
                tripPlan: {
                    ...updatedTripPlan,
                    daily_plan: updatedDailyPlan
                }
            });
    
            router.back();
        } catch (error) {
            console.error('Error adding place:', error);
            Alert.alert('Error', 'Failed to add place. Please try again.');
        }
    }

    return (
        <SafeAreaView className="bg-backBlue flex-1">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className='p-6 pt-16'>
                    <GooglePlacesAutocomplete
                        placeholder='Search Place'
                        onPress={(data, details = null) => {
                            handlePlaceSelection(data, details);
                        }}
                        query={{
                            key: GOOGLE_MAPS_API_KEY,
                            language: 'en',
                            fields: 'name,editorial_summary,opening_hours,formatted_address,photos,current_opening_hours'
                        }}
                        fetchDetails={true}
                        enablePoweredByContainer={false}
                        styles={{
                            container: {
                                flex: 1,
                                position: 'absolute',
                                top: 70,
                                left: 20,
                                right: 20,
                                zIndex: 1,
                            },
                            textInputContainer: {
                                backgroundColor: '#E5E8F8',
                                borderRadius: 20,
                                borderWidth: 2,
                                borderColor: 'black',
                                overflow: 'hidden',
                            },
                            textInput: {
                                backgroundColor: '#E5E8F8',
                                height: 45,
                                color: '#5d5d5d',
                                fontSize: 16,
                                borderRadius: 20,
                            },
                            listView: {
                                backgroundColor: 'white',
                                borderRadius: 20,
                                marginTop: 10,
                            }
                        }}
                    />
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

export default SearchLocation;