import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { sendPasswordResetEmail } from '../../firebaseConfig'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert(
        'Missing Information',
        'Please enter your email address'
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
  
    setIsLoading(true)
    try {
      await sendPasswordResetEmail(email)
      Alert.alert(
        'Success',
        'If an account exists with this email, you will receive a password reset link. Please check your inbox.',
        [
          {
            text: 'OK',
            onPress: () => {
              setEmail('')
              router.replace('/sign-in')
            }
          }
        ]
      )
    } catch (error) {
      console.log('Reset password error:', error)
      if (error.code === 'auth/invalid-email') {
        Alert.alert(
          'Invalid Email',
          'Please enter a valid email address.'
        )
      } else if (error.code === 'auth/too-many-requests') {
        Alert.alert(
          'Too Many Attempts',
          'Too many password reset attempts. Please try again later.'
        )
      } else {
        Alert.alert(
          'Error',
          'Failed to send reset email. Please try again.'
        )
      }
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
            containerStyles="mt-7 h-[55px]"
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