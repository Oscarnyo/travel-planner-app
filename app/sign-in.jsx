import { View, Text,ScrollView, Image, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'

import {images} from '../constants'
import FormField from '../components/FormField'
import CustomButton from '../components/CustomButton'
import { Link, router, useRouter } from 'expo-router'

import { signIn } from '../firebaseConfig';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)/planner');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <SafeAreaView className="h-full bg-backBlue">
      <ScrollView>
        <View className="w-full justify-center h-full px-4  mx-1 ">
          <Image 
            source={images.signIn}
            resizeMode='contain'
            className="w-[400px] h-[300px]"
          />
          
          <Text className="text-3xl text-black text-semibold font-bold">
            Sign in
          </Text>
          <Text className=" text-gray-500">
            Please login to continue to your account.
          </Text>
          
          <FormField
            title="Email"
            value={email}
            handleChangeText={setEmail}
            otherStyles="mt-5"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={password}
            handleChangeText={setPassword}
            otherStyles="mt-5"
          />
          
          <CustomButton
            title='Sign in'
            handlePress={handleSignIn}
            containerStyles="mt-7"
            isLoading={isLoading}
          />
          
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-400 font-medium">
              Dont have an account?
            </Text>
            <Link href="sign-up" className='text-lg font-semibold text-secondary'>
              Sign Up
            </Link>
          </View>
          
        </View>
      </ScrollView>
      <StatusBar style='dark'/>
    </SafeAreaView>
  )
}

export default SignIn