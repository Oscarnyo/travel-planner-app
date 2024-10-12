import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { images } from '../constants'
import FormField from '../components/FormField'
import CustomButton from '../components/CustomButton'
import { Link, router } from 'expo-router'
import { sendPasswordResetEmail } from '../firebaseConfig'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address')
      return
    }

    setIsLoading(true)
    try {
      await sendPasswordResetEmail(email)
      Alert.alert('Success', 'Password reset email sent. Please check your inbox.')
      router.replace('/sign-in')
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView className="h-full bg-backBlue">
      <ScrollView>
        <View className="w-full justify-center h-[75vh] px-4 mx-1">
          <Image 
            source={images.resetpass}
            resizeMode='contain'
            className="w-[400px] h-[300px]"
          />
          
          <Text className="text-3xl text-black text-semibold font-bold">
            Forgot Password
          </Text>
          <Text className="text-gray-500">
            Enter your email to receive a password reset link.
          </Text>
          
          <FormField
            title="Email"
            value={email}
            handleChangeText={setEmail}
            otherStyles="mt-5"
            keyboardType="email-address"
            titleColor="text-gray-500"
          />
          
          <CustomButton
            title='Reset Password'
            handlePress={handleResetPassword}
            containerStyles="mt-7"
            isLoading={isLoading}
          />
          
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-400 font-medium">
              Remember your password?
            </Text>
            <Link href="/sign-in" className='text-lg font-semibold text-secondary'>
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
      <StatusBar style='dark'/>
    </SafeAreaView>
  )
}

export default ForgotPassword