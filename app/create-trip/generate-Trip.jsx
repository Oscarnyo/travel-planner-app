import { View, Text, TouchableOpacity,FlatList, ToastAndroid , Image} from 'react-native'
import React, { useEffect, useRef, useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { createTripContext } from './../../context/createTripContext';
import { router } from 'expo-router';
import {images} from '../../constants';
import { AI_PROMPT } from '../../constants/options';
import { tr } from 'date-fns/locale';
import { chatSession } from '../../AiModal';
import {doc, setDoc} from 'firebase/firestore';
import {auth,db} from '../../firebaseConfig';

const GenerateTrip = () => {
  
  const {tripData, setTripData} = useContext(createTripContext);
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser
  
  useEffect(() => {
    GenerateAiTrip()
  }, [])
  
  const GenerateAiTrip = async () =>{
    
    setLoading(true)
    
    const FINAL_PROMPT=AI_PROMPT
    .replace('{location}',tripData?.locationInfo?.name)
    .replace('{totalDays}',tripData?.totalNoOfDays)
    .replace('{totalNight}',tripData?.totalNoOfDays-1)
    .replace('{traveler}',tripData?.traveler?.title)
    .replace('{budget}',tripData?.budget)
    .replace('{totalDays}',tripData?.totalNoOfDays)
    .replace('{totalNight}',tripData?.totalNoOfDays-1)
    
    console.log(FINAL_PROMPT);
    
    const result = await chatSession.sendMessage(FINAL_PROMPT);
    console.log(result.response.text());
    
    setLoading(false)
    
    const tripResp = JSON.parse(result.response.text())
    const docId=(Date.now()).toString()
    const result_ = await setDoc(doc(db, "users", docId),{
      userEmail:user.email,
      tripPlan: tripResp, // AI result
      tripData:JSON.stringify(tripData), //User selection
      docId:docId
    })
    
    router.push('(tabs)/planner')
    
  }
  
  return (
    <SafeAreaView className="bg-backBlue flex-1 h-full">
      <View className='p-6 pt-20'>
      
        <Text
          className='text-[35px] font-bold text-center'>
          Please Wait...
        </Text>
        
        <Text
          className='text-[20px] font-medium text-center mt-5'>
          We are generating your trip
        </Text>
        
        <Image source={images.plane} className=' w-[55%] h-[220px] mt-10 object-contain self-center'/>
        
        
        
      </View>
    </SafeAreaView>
  )
}

export default GenerateTrip