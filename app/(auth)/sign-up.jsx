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
    // Input validation
    if (!username && !email && !password) {
      Alert.alert(
        'Missing Information',
        'Please fill in all required fields'
      )
      return
    }
  
    if (!username) {
      Alert.alert(
        'Missing Information',
        'Please enter a username'
      )
      return
    }
  
    if (!email) {
      Alert.alert(
        'Missing Information',
        'Please enter your email'
      )
      return
    }
  
    if (!password) {
      Alert.alert(
        'Missing Information',
        'Please enter a password'
      )
      return
    }
  
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Alert.alert(
        'Invalid Email',
        'Please enter a valid email address'
      )
      return
    }
  
    // Password strength validation
    if (password.length < 6) {
      Alert.alert(
        'Weak Password',
        'Password must be at least 6 characters long'
      )
      return
    }
  
    setIsLoading(true)
    try {
      await signUp(email, password, username)
      Alert.alert(
        'Success',
        'Account created successfully! Please sign in with your new account.',
        [
          {
            text: 'OK',
            onPress: () => {
              setEmail('')
              setPassword('')
              setUserame('')
              router.replace('sign-in')
            }
          }
        ]
      )
    } catch (error) {
      console.log('Sign up error:', error)
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert(
          'Email Already Exists',
          'An account with this email already exists. Please use a different email or sign in.'
        )
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert(
          'Invalid Email',
          'Please enter a valid email address.'
        )
      } else {
        Alert.alert(
          'Error',
          'Failed to create account. Please try again.'
        )
      }
    } finally {
      setIsLoading(false)
    }
  }
  
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
            containerStyles="mt-7 h-[55px]"
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