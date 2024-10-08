import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthContext } from '../../context/authContext'
import { signOutUser } from '../../firebaseConfig'
import { router } from 'expo-router'
import CustomButton from '../../components/CustomButton'



const profile = () => {
  const { user, setUser, username } = useContext(AuthContext)

  const handleLogout = async () => {
    try {
      await signOutUser()
      setUser(null)
      router.replace('/sign-in')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }
  
  return (
    <SafeAreaView className="flex-1 bg-backBlue p-4">
    <View className="flex-1 justify-between">
      <View>
        <Text className="text-2xl font-bold mb-4">Profile</Text>
        {user && (
          <Text className="text-lg">Welcome, {username}</Text>
        )}
      </View>
      <CustomButton
        title="Logout"
        handlePress={handleLogout}
        containerStyles="bg-red-500 mb-5 w-full"
        textStyles="text-lg"
      />
    </View>
  </SafeAreaView>
  )
}

export default profile

