import { View, Text, Image } from 'react-native'
import React from 'react'

const UserTripList = ({userTrips}) => {
  return (
    <View>
      <View className='mt-5'>
        <Image source={require('./../../assets/images/samplePlace.jpg')}
            className='w-full h-[240] object-cover rounded-3xl'
        />
        <View className=' mt-3'>
            <Text
            className="font-medium text-[20px] ml-[2px]"
            >{userTrips[0]?.tripPlan?.location}</Text>
        </View>
      </View>
    </View>
  )
}

export default UserTripList