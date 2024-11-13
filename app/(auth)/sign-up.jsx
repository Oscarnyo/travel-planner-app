import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'

import {images} from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link } from 'expo-router'

import { router } from 'expo-router'
import { signUp } from '../../firebaseConfig'

const SignUp = () => {
  const [username, setUserame] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  
  const handleSignUp = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    setIsLoading(true);
    try {
      await signUp(email, password, username);
      Alert.alert('Success', 'Account created successfully');
      router.replace('sign-in');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
    };
  
  return (
    <SafeAreaView className="h-full bg-backBlue">
      <ScrollView>
        <View className="w-full justify-center h-full px-4 ">
          <Image 
            source={images.signIn}
            resizeMode='contain'
            className="w-[400px] h-[300px] self-center"
          />
          
          <Text className="text-3xl text-black text-semibold font-bold">
            Sign up
          </Text>
          <Text className=" text-gray-500">
            Sign up to enjoy the feature of travel planner
          </Text>
          
          <FormField
            title="Username"
            value={username}
            handleChangeText={setUserame}
            otherStyles="mt-5"
            titleColor="text-gray-500"
          />
          <FormField
            title="Email"
            value={email}
            handleChangeText={setEmail}
            otherStyles="mt-5"
            keyboardType="email-address"
            titleColor="text-gray-500"
          />
          <FormField
            title="Password"
            value={password}
            handleChangeText={setPassword}
            otherStyles="mt-5"
            titleColor="text-gray-500"
          />
          
          <CustomButton
            title='Sign up'
            handlePress={handleSignUp}
            containerStyles="mt-7 h-[50px]"
            isLoading={isLoading}
          />
          
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-400 font-medium">
              Have an account already?
            </Text>
            <Link href="/sign-in" className='text-lg font-semibold text-secondary'>
              Sign in
            </Link>
          </View>
          
        </View>
      </ScrollView>
      <StatusBar style='dark'/>
    </SafeAreaView>
  )
}

export default SignUp