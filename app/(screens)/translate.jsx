import React, { useState } from 'react'
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Modal, 
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard 
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import * as Speech from 'expo-speech'
import { router } from 'expo-router'
import { GOOGLE_CLOUD_API_KEY } from '@env'

const LANGUAGES = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  ar: "Arabic",
  hi: "Hindi",
  th: "Thai",
  vi: "Vietnamese",
  id: "Indonesian",
  ms: "Malay",
  tr: "Turkish",
  nl: "Dutch",
  pl: "Polish",
  da: "Danish",
  fi: "Finnish",
  sv: "Swedish",
  el: "Greek",
  he: "Hebrew"
}

const TranslateComponent = () => {
  const [text, setText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectingLanguage, setSelectingLanguage] = useState('from')
  const [fromLanguage, setFromLanguage] = useState('en')
  const [toLanguage, setToLanguage] = useState('es')

  const handleLanguageSelect = (langCode) => {
    if (selectingLanguage === 'from') {
      setFromLanguage(langCode)
    } else {
      setToLanguage(langCode)
    }
    setModalVisible(false)
  }

  const handleSpeak = async (textToSpeak, language) => {
    try {
      // Stop any ongoing speech
      await Speech.stop()
      
      // Get available voices for the language
      const voices = await Speech.getAvailableVoicesAsync()
      const languageVoice = voices.find(voice => voice.language.startsWith(language))
      
      // Configure speech options
      const options = {
        language: language,
        voice: languageVoice?.identifier,
        pitch: 1.0,
        rate: 0.75 // Slightly slower rate for better clarity
      }
      
      await Speech.speak(textToSpeak, options)
    } catch (error) {
      console.error('Speech error:', error)
    }
  }

  const handleTranslate = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_CLOUD_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            target: toLanguage,
            source: fromLanguage
          })
        }
      )
      const data = await response.json()
      if (data.data.translations[0].translatedText) {
        setTranslatedText(data.data.translations[0].translatedText)
        // Removed the automatic Speech.speak call here
      }
    } catch (error) {
      console.error('Translation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const LanguageModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-4 h-3/4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold">Select Language</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {Object.entries(LANGUAGES).map(([code, name]) => (
              <TouchableOpacity
                key={code}
                className="p-4 border-b border-gray-200"
                onPress={() => handleLanguageSelect(code)}
              >
                <Text className="text-lg">{name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-backBlue p-4">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#367AFF" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold flex-1 text-center">Translate</Text>
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity 
            className="bg-white p-3 rounded-xl w-[150px]"
            onPress={() => {
              setSelectingLanguage('from')
              setModalVisible(true)
            }}
          >
            <Text className="text-center font-semibold">{LANGUAGES[fromLanguage]}</Text>
          </TouchableOpacity>

          <View className="mx-2">
            <Ionicons name="arrow-forward" size={24} color="#367AFF" />
          </View>
          
          <TouchableOpacity 
            className="bg-white p-3 rounded-xl w-[150px]"
            onPress={() => {
              setSelectingLanguage('to')
              setModalVisible(true)
            }}
          >
            <Text className="text-center font-semibold">{LANGUAGES[toLanguage]}</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1">
          <View className="bg-white p-4 rounded-xl mb-4 flex-1">
            <TextInput
              className="flex-1"
              placeholder="Enter text to translate..."
              value={text}
              onChangeText={setText}
              multiline
              textAlignVertical="top"
            />
            {text && (
              <TouchableOpacity 
                className="absolute right-2 bottom-2" 
                onPress={() => handleSpeak(text, fromLanguage)}
              >
                <Ionicons name="volume-high" size={24} color="#367AFF" />
              </TouchableOpacity>
            )}
          </View>

          <View className="bg-white p-4 rounded-xl mb-4 flex-1">
            {translatedText ? (
              <>
                <Text className="text-lg flex-1">{translatedText}</Text>
                <TouchableOpacity 
                  className="absolute right-2 bottom-2" 
                  onPress={() => handleSpeak(translatedText, toLanguage)}
                >
                  <Ionicons name="volume-high" size={24} color="#367AFF" />
                </TouchableOpacity>
              </>
            ) : (
              <Text className="text-gray-400">Translation will appear here</Text>
            )}
          </View>

          <TouchableOpacity
            className={`bg-secondary p-4 my-2 rounded-xl ${loading ? 'opacity-50' : ''}`}
            onPress={handleTranslate}
            disabled={loading || !text.trim()}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-bold text-lg">Translate</Text>
            )}
          </TouchableOpacity>
        </View>

        <LanguageModal />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

export default TranslateComponent