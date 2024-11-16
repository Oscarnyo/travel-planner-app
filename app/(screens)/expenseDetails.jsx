import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { db } from '../../firebaseConfig'
import { doc, deleteDoc, onSnapshot, updateDoc, arrayRemove } from 'firebase/firestore'
import { icons } from '../../constants'

const ExpenseDetails = () => {
  const params = useLocalSearchParams()
  const [category, setCategory] = useState(null)
  const [expenses, setExpenses] = useState([])

  useEffect(() => {
    if (params.categoryId) {
      const unsubscribe = onSnapshot(doc(db, "expenseCategories", params.categoryId), (doc) => {
        if (doc.exists()) {
          setCategory(doc.data())
          setExpenses(doc.data().expenses || [])
        }
      })
      return () => unsubscribe()
    }
  }, [params.categoryId])

  const calculateProgress = () => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    return (total / category.budget) * 100
  }
  
  const handleDeleteCategory = () => {
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "expenseCategories", params.categoryId))
              router.back()
            } catch (error) {
              console.error("Error deleting category:", error)
            }
          },
          style: "destructive"
        }
      ]
    )
  }

  const handleDeleteExpense = (expense) => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const categoryRef = doc(db, "expenseCategories", params.categoryId)
              await updateDoc(categoryRef, {
                expenses: arrayRemove(expense),
                currentSpending: category.currentSpending - expense.amount
              })
            } catch (error) {
              console.error("Error deleting expense:", error)
            }
          },
          style: "destructive"
        }
      ]
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-backBlue">
    <ScrollView className="flex-1 p-4">
      {category && (
        <>
        {/* Header with Delete Button */}
        <View className="mb-6 flex-row justify-between items-center">
            <View className="flex-row items-center flex-1">
                <Text className="text-4xl mb-2">{category.icon}</Text>
                <Text className="text-2xl font-bold ml-2">{category.name}</Text>
            </View>
            <TouchableOpacity
                onPress={handleDeleteCategory}
                className="p-2"
            >
              <Ionicons name="trash-outline" size={20} color="red" />
              </TouchableOpacity>
        </View>

          {/* Budget Progress Bar */}
          <View className="bg-white rounded-xl p-4 mb-6">
            <View className="flex-row justify-between mb-2">
              <Text className="font-semibold">Budget Progress</Text>
              <Text className="text-gray-600">
                RM {expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)} / RM {category.budget}
              </Text>
            </View>
            <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <View 
                className="h-full rounded-full"
                style={{ 
                  width: `${Math.min(calculateProgress(), 100)}%`,
                  backgroundColor: category.color
                }}
              />
            </View>
          </View>

          {/* Updated Expenses List */}
          <View>
              <Text className="text-xl font-bold mb-4 ml-1">Expenses</Text>
              {expenses.map((expense, index) => (
                <View key={index} className="bg-white p-4 rounded-xl mb-3 flex-row justify-between items-center">
                  <View>
                    <Text className="font-semibold text-lg">{expense.name}</Text>
                    <Text style={{ color: category.color }} className="font-bold">
                      RM {expense.amount.toFixed(2)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteExpense(expense)}
                    className="p-2"
                  >
                    <Ionicons name="close-circle-outline" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
        </>
      )}
    </ScrollView>

    {/* Add Expense Button */}
    <TouchableOpacity
      className="absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center bg-secondary"
      onPress={() => router.push({
        pathname: '/(screens)/addExpense',
        params: { categoryId: params.categoryId }
      })}
    >
      <Ionicons name="add" size={30} color="white" />
    </TouchableOpacity>
  </SafeAreaView>
  )
}

export default ExpenseDetails