import { View, Text, Image } from 'react-native'
import React from 'react'
import moment from 'moment'
import CustomButton from '../../components/CustomButton';
import { router } from 'expo-router';
import UserTripCard from './UserTripCard';
import { GOOGLE_MAPS_API_KEY } from '@env';
import Ionicons from '@expo/vector-icons/Ionicons';

const UserTripList = ({userTrips}) => {
  
  const LatestTrip=JSON.parse(userTrips[0].tripData)
  
  
  return(
    <View>
      <View className='mt-3'>
        
        {LatestTrip?.locationInfo?.photoRef?
          <Image source={{uri:'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+LatestTrip.locationInfo.photoRef+'&key='+GOOGLE_MAPS_API_KEY}}
          
          className='w-full h-[240] object-cover rounded-2xl'
          />
        :
        <Image source={require('./../../assets/images/samplePlace.jpg')}
            className='w-full h-[240] object-cover rounded-3xl'
        />
        }
        <View className=' mt-2 '>
            <Text
            className="font-medium text-[24px] ml-[2px]"
            >{userTrips[0]?.tripPlan?.location}</Text>
            
            <View className=' flex-row justify-between mt-1'>
            
              <View className='flex-row items-center ml-[2px]'>
                <Ionicons name="calendar" size={18} color="#367AFF" />
                <Text
                  className='font-normal text-[17px] ml-[2px] text-gray-500'
                  > {moment(LatestTrip.startDate).format('DD MMM yyyy')}
                </Text>
              </View>
              <View className='flex-row items-center'>
                <Ionicons name="people-sharp" size={18} color="#367AFF" />
                <Text
                className='font-normal text-[17px] text-gray-500 ml-[2px]'
                > {LatestTrip.traveler.title}
                </Text>
              </View>
            </View>
            
            <CustomButton
              title='See Your Trip'
              handlePress={() => router.push({pathname:'/trip-details',params:{
                trip:JSON.stringify(userTrips[0])
              }})}
              containerStyles=" mt-3 w-[405px] h-[50px] self-center mb-3"
              textStyles="text-[20px]"
            />
        </View>
        
        {userTrips.slice(1).map((trip, index) => (
          <UserTripCard trip={trip} key={index} />
        ))}
        
      </View>
    </View>
  )
}

export default UserTripList