import { View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
import { GOOGLE_MAPS_API_KEY } from '@env'
import { Keyboard, TouchableWithoutFeedback } from 'react-native'
import { router } from 'expo-router'

const SearchLocation = () => {
    return (
        <SafeAreaView className="bg-backBlue flex-1">
            <TouchableWithoutFeedback onPress={() => {
                Keyboard.dismiss();
            }}>
                <View className='p-6 pt-16'>
                    <GooglePlacesAutocomplete
                        placeholder='Search Place'
                        onPress={(data, details = null) => {
                            console.log('Search result:', data, details);
                            if (details) {
                                console.log('Selected place data:', {
                                    name: details.name,
                                    address: details.formatted_address,
                                    location: details.geometry.location,
                                    photos: details.photos
                                });

                                // Navigate back to trip details
                                router.back();
                                
                            }
                        }}
                        query={{
                            key: GOOGLE_MAPS_API_KEY,
                            language: 'en',
                        }}
                        fetchDetails={true}
                        enablePoweredByContainer={false}
                        onFail={error => console.error('GooglePlacesAutocomplete error:', error)}
                        onNotFound={() => console.log('No results found')}
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

export default SearchLocation