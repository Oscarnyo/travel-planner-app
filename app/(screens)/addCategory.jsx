import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { db, auth } from '../../firebaseConfig'
import { collection, addDoc } from 'firebase/firestore'
import { router } from 'expo-router'

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#F5D454',
  '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71',
  '#BAF9FC', '#E1D5FF'
]

const AddCategory = () => {
  const [icon, setIcon] = useState('')
  const [color, setColor] = useState(COLORS[0])
  const [name, setName] = useState('')
  const [budget, setBudget] = useState('')

  const handleCreate = async () => {
    // Input validation
    if (!icon && !name && !budget) {
      Alert.alert(
        'Missing Information',
        'Please fill in all fields (Icon, Category Name, and Budget)'
      )
      return
    }
  
    if (!icon) {
      Alert.alert(
        'Missing Information',
        'Please add an icon (emoji) for your category'
      )
      return
    }
  
    if (!name) {
      Alert.alert(
        'Missing Information',
        'Please enter a name for your category'
      )
      return
    }
  
    if (!budget) {
      Alert.alert(
        'Missing Information',
        'Please enter a budget amount'
      )
      return
    }
  
    // Validate budget is a valid number
    if (isNaN(parseFloat(budget)) || parseFloat(budget) <= 0) {
      Alert.alert(
        'Invalid Budget',
        'Please enter a valid budget amount greater than 0'
      )
      return
    }
  
    try {
      const user = auth.currentUser
      await addDoc(collection(db, "expenseCategories"), {
        userId: user.uid,
        icon,
        color,
        name,
        budget: parseFloat(budget),
        currentSpending: 0,
        createdAt: new Date()
      })
      router.back()
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to create category. Please try again.'
      )
      console.error("Error creating category:", error)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-backBlue p-4">
      <ScrollView>
        <Text className="text-2xl font-bold mb-6">Create Category</Text>

        {/* Form Fields */}
        <View className="bg-white p-4 rounded-xl mb-4">
          <TextInput
            className="border-b border-gray-300 p-2 mb-4"
            placeholder="Icon (emoji)"
            value={icon}
            onChangeText={setIcon}
          />
          <TextInput
            className="border-b border-gray-300 p-2 mb-4"
            placeholder="Category Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            className="border-b border-gray-300 p-2"
            placeholder="Budget"
            value={budget}
            onChangeText={setBudget}
            keyboardType="numeric"
          />
        </View>

        {/* Color Selector */}
        <View className="bg-white p-4 rounded-xl mb-4">
          <Text className="text-gray-600 mb-2">Select Color</Text>
          <View className="flex-row flex-wrap justify-between">
            {COLORS.map((c, index) => (
              <TouchableOpacity
                key={index}
                className={`w-12 h-12 rounded-full m-2 ${color === c ? 'border-4 border-gray-400' : ''}`}
                style={{ backgroundColor: c }}
                onPress={() => setColor(c)}
              />
            ))}
          </View>
        </View>

        {/* Create Button */}
        <TouchableOpacity
          className="bg-secondary p-3 rounded-xl"
          onPress={handleCreate}
        >
          <Text className="text-white text-center font-bold text-lg">
            Create Category
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AddCategory