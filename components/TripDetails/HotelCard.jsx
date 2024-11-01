import { View, Text, Image, TouchableOpacity, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GetPhotoRef } from '../../services/GooglePlaceApi'
import { GOOGLE_MAPS_API_KEY } from '@env';

const HotelCard = ({item}) => {
    const [photoRef, setPhotoRef] = useState(null);
    
    useEffect(() => {
        GetGooglePhoto();
    }, [item.hotel_name]);
    
    const GetGooglePhoto = async () => {
        try {
            const result = await GetPhotoRef(item.hotel_name);
            setPhotoRef(result);
        } catch (error) {
            console.error('Error fetching photo:', error);
        }
    }
    
    const openInGoogleMaps = () => {
        const encodedPlace = encodeURIComponent(item.hotel_name);
        const url = `https://www.google.com/maps/search/?api=1&query=${encodedPlace}`;
        Linking.openURL(url).catch(err => console.error('Error opening maps:', err));
    };
    
    return (
        <TouchableOpacity 
            onPress={openInGoogleMaps}
            activeOpacity={0.7}
            className='mr-5 w-[180]'
        >
            {photoRef ? (
                <Image 
                    className='w-[180] h-[120] rounded-xl'
                    source={{
                        uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${GOOGLE_MAPS_API_KEY}`
                    }}
                />
            ) : (
                <Image 
                    className='w-[180] h-[120] rounded-xl'
                    source={require('./../../assets/images/samplePlace.jpg')}
                />
            )}
            <View className='mt-[2px]'>
                <Text className='font-medium text-[17px]'>
                    {item.hotel_name}
                </Text>
                <View>
                    <Text className='font-normal mt-[2px]'>⭐ {item.rating}</Text>
                    <Text className='font-normal ml-[1px] mt-[2px]'>💵 {item.price}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default HotelCard