import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const expense = () => {
  return (
    <SafeAreaView className="flex-1 bg-backBlue p-4">
      <View>
        <Text>expense</Text>
      </View>
    </SafeAreaView>
  )
}

export default expense