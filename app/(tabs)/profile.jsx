import { View, Text, Image, ScrollView, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthContext } from '../../context/authContext'
import { signOutUser, changePassword } from '../../firebaseConfig'
import { router } from 'expo-router'
import CustomButton from '../../components/CustomButton'
import FormField from '../../components/FormField'
import { images } from '../../constants'
import { KeyboardAvoidingView, Platform } from 'react-native'


const profile = () => {
  const { user, setUser, username } = useContext(AuthContext)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes", 
          onPress: async () => {
            try {
              await signOutUser()
              setUser(null)
              router.replace('/sign-in')
            } catch (error) {
              console.error('Logout error:', error)
              Alert.alert('Error', 'Failed to log out. Please try again.')
            }
          }
        }
      ],
      { cancelable: false }
    );
  }
  
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      Alert.alert('Error', 'Please fill in both password fields')
      return
    }

    setIsLoading(true)
    try {
      await changePassword(oldPassword, newPassword)
      Alert.alert('Success', 'Password changed successfully')
      setOldPassword('')
      setNewPassword('')
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <SafeAreaView className="flex-1 bg-backBlue">
    <KeyboardAvoidingView 
      behavior={Platform.OS === "android" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4" keyboardShouldPersistTaps="handled">
        <View className="flex-1 ">
          <View className="items-center">
            <Image 
              source={images.user}
              resizeMode='contain'
              className="w-32 h-32 rounded-full mb-8 mt-6"
            />
            <FormField
              title="Username"
              value={username}
              otherStyles="mb-4"
              editable={false}
              valueTextColor="text-gray-500"
            />
            <FormField
              title="Email"
              value={user?.email}
              otherStyles="mb-4"
              editable={false}
              valueTextColor="text-gray-500"
            />
            
            <FormField
              title="Old Password"
              value={oldPassword}
              handleChangeText={setOldPassword}
              otherStyles="mb-4"
              secureTextEntry={true}
            />
            <FormField
              title="New Password"
              value={newPassword}
              handleChangeText={setNewPassword}
              otherStyles="mb-5"
              secureTextEntry={true}
            />
            {newPassword !== '' && (
              <CustomButton
                title="Save"
                handlePress={handleChangePassword}
                containerStyles="bg-secondary mt-14 w-[220px] h-[50px]"
                textStyles="text-lg text-[20px]"
                isLoading={isLoading}
              />
            )}
          </View>
          <View className="justify-center items-center mt-auto">
            <CustomButton
              title="Logout"
              handlePress={handleLogout}
              containerStyles="bg-red-500 mb-8 w-[220px] h-[50px]"
              textStyles="text-lg text-[20px]"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
  )
}

export default profile

