import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { PieChart } from 'react-native-chart-kit'
import { db, auth } from '../../firebaseConfig'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { icons } from '../../constants'

const Expense = () => {
  const [categories, setCategories] = useState([])
  const [totalSpending, setTotalSpending] = useState(0)

  useEffect(() => {
    const user = auth.currentUser
    if (user) {
      const q = query(collection(db, "expenseCategories"), where("userId", "==", user.uid))
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const categoriesData = []
        let total = 0
        querySnapshot.forEach((doc) => {
          const category = { id: doc.id, ...doc.data() }
          total += category.currentSpending || 0
          categoriesData.push(category)
        })
        setCategories(categoriesData)
        setTotalSpending(total)
      })
      return () => unsubscribe()
    }
  }, [])

  const chartData = categories.length > 0 
  ? categories.some(category => (category.currentSpending || 0) > 0)
    ? categories.map(category => ({
        name: category.name,
        spending: category.currentSpending || 0,
        color: category.color,
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
        legendFontFamily: 'System',
      }))
    : [{
        name: 'No expenses yet',
        spending: 1,
        color: '#E5E7EB', // light grey color
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
        legendFontFamily: 'System',
      }]
  : [{
      name: 'No categories',
      spending: 1,
      color: '#E5E7EB', // light grey color
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
      legendFontFamily: 'System',
    }];

  return (
    <SafeAreaView className="flex-1 bg-backBlue">
      <ScrollView className="flex-1 p-4">
        {/* Header with Currency Converter */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold">Expenses</Text>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => router.push('/(screens)/currencyConverter')}
        >
          <Image 
              source={icons.exchange} 
              className="w-7 h-7"
          />
        </TouchableOpacity>
      </View>
        
        {/* Donut Chart */}
        <View className="bg-white rounded-2xl p-4 mb-6 shadow-lg" style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
          <PieChart
            data={chartData}
            width={350}
            height={200}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="spending"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute={false}
            hasLegend={categories.length > 0 && categories.some(category => (category.          currentSpending || 0) > 0)}
          />
          <Text className="text-center text-lg mt-2">
            Total: RM {totalSpending.toFixed(2)}
          </Text>
        </View>
  
        {/* Categories Section */}
        <View>
          <Text className="text-xl font-bold mb-4">Categories</Text>
          <View className="flex-row flex-wrap justify-between">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                className="bg-white w-[48%] rounded-xl p-4 mb-4 shadow-md"
                style={{
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.15,
                  shadowRadius: 2.84,
                  elevation: 3,
                }}
                onPress={() => router.push({
                  pathname: '/(screens)/expenseDetails',
                  params: { categoryId: category.id }
                })}
              >
                <Text className="text-3xl mb-2">{category.icon}</Text>
                <Text className="font-semibold">{category.name}</Text>
                <Text className="text-gray-600">
                  RM {category.currentSpending?.toFixed(2) || '0.00'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
  
      {/* Add Category Button */}
      <TouchableOpacity
        className="absolute bottom-7 right-5 bg-secondary w-14 h-14 rounded-full items-center justify-center"
        onPress={() => router.push('/(screens)/addCategory')}
      >
        <Ionicons name="add" size={34} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Expense