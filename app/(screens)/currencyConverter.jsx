import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

const CURRENCIES = {
    MYR: "Malaysian Ringgit",
    USD: "US Dollar",
    EUR: "Euro",
    GBP: "British Pound",
    JPY: "Japanese Yen",
    AUD: "Australian Dollar",
    CAD: "Canadian Dollar",
    CHF: "Swiss Franc",
    CNY: "Chinese Yuan",
    HKD: "Hong Kong Dollar",
    NZD: "New Zealand Dollar",
    SEK: "Swedish Krona",
    KRW: "South Korean Won",
    SGD: "Singapore Dollar",
    THB: "Thai Baht",
    IDR: "Indonesian Rupiah",
    PHP: "Philippine Peso",
    TWD: "Taiwan Dollar"
  }

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState('MYR')
  const [toCurrency, setToCurrency] = useState('USD')
  const [exchangeRates, setExchangeRates] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectingCurrency, setSelectingCurrency] = useState('from') // 'from' or 'to'

  useEffect(() => {
    fetchExchangeRates()
  }, [])

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch(
        'https://api.exchangerate-api.com/v4/latest/MYR'
      )
      const data = await response.json()
      setExchangeRates(data.rates)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching exchange rates:', error)
      setLoading(false)
    }
  }

  const convertCurrency = (value, from, to) => {
    if (!exchangeRates || !value) return '0.00'
    
    // Convert to MYR first (base currency)
    const inMYR = from === 'MYR' ? value : value / exchangeRates[from]
    // Convert from MYR to target currency
    const converted = to === 'MYR' ? inMYR : inMYR * exchangeRates[to]
    return converted.toFixed(2)
  }
  
  const handleCurrencySelect = (currency) => {
    if (selectingCurrency === 'from') {
      setFromCurrency(currency)
    } else {
      setToCurrency(currency)
    }
    setModalVisible(false)
  }

  const CurrencyModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-4 h-3/4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold">Select Currency</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {Object.entries(CURRENCIES).map(([code, name]) => (
              <TouchableOpacity
                key={code}
                className="p-4 border-b border-gray-200"
                onPress={() => handleCurrencySelect(code)}
              >
                <Text className="text-lg">{code} - {name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
  
  
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-backBlue justify-center items-center">
        <ActivityIndicator size="large" color="#367AFF" />
        <Text className="mt-2 text-gray-600">Loading exchange rates...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-backBlue">
      <ScrollView className="flex-1 p-4">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold">Currency Converter</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>
  
        <View className="bg-white rounded-xl p-4 mb-4 shadow-lg">
          <TextInput
            className="border-b border-gray-300 p-2 mb-4"
            placeholder="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
  
          <View className="flex-row justify-between mb-4">
            <TouchableOpacity 
              className="bg-gray-100 p-3 rounded-xl flex-1 mr-2"
              onPress={() => {
                setSelectingCurrency('from')
                setModalVisible(true)
              }}
            >
              <Text className="text-center font-semibold">{fromCurrency}</Text>
              <Text className="text-center text-gray-500 text-xs mt-1">
                {CURRENCIES[fromCurrency]}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-gray-100 p-3 rounded-xl flex-1 ml-2"
              onPress={() => {
                setSelectingCurrency('to')
                setModalVisible(true)
              }}
            >
              <Text className="text-center font-semibold">{toCurrency}</Text>
              <Text className="text-center text-gray-500 text-xs mt-1">
                {CURRENCIES[toCurrency]}
              </Text>
            </TouchableOpacity>
          </View>
  
          {amount ? (
            <View className="bg-gray-50 p-4 rounded-xl">
              <Text className="text-center text-lg">
                {amount} {fromCurrency} = {convertCurrency(parseFloat(amount), fromCurrency, toCurrency)} {toCurrency}
              </Text>
            </View>
          ) : null}
  
          <Text className="text-xs text-gray-500 text-center mt-4">
            Exchange rates provided by exchangerate.com
          </Text>
        </View>
      </ScrollView>
      <CurrencyModal />
    </SafeAreaView>
  )
}

export default CurrencyConverter