import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { db } from '../../firebaseConfig'
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'

const AddExpense = () => {
  const params = useLocalSearchParams()
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')

  const handleAddExpense = async () => {
    if (!name || !amount) return

    try {
      const categoryRef = doc(db, "expenseCategories", params.categoryId)
      const categoryDoc = await getDoc(categoryRef)
      
      if (categoryDoc.exists()) {
        const currentSpending = categoryDoc.data().currentSpending || 0
        await updateDoc(categoryRef, {
          expenses: arrayUnion({
            name,
            amount: parseFloat(amount),
            createdAt: new Date()
          }),
          currentSpending: currentSpending + parseFloat(amount)
        })
        router.back()
      }
    } catch (error) {
      console.error("Error adding expense:", error)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-backBlue p-4">
      <Text className="text-2xl font-bold mb-6">Add Expense</Text>

      <View className="bg-white p-4 rounded-xl mb-4">
        <TextInput
          className="border-b border-gray-300 p-2 mb-4"
          placeholder="Expense Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          className="border-b border-gray-300 p-2"
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity
        className="bg-secondary p-4 rounded-xl"
        onPress={handleAddExpense}
      >
        <Text className="text-white text-center font-bold text-lg">
          Add Expense
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default AddExpense