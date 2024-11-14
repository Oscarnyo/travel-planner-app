import React, { useState, useEffect } from "react";
import * as GoogleGenerativeAI from "@google/generative-ai";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { GOOGLE_GERMINI_API_KEY } from '@env';

const GeminiChat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const startChat = async () => {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(GOOGLE_GERMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = "You are a travel assistant. Provide a brief, friendly greeting and ask how you can help plan their perfect trip.";
      
      try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        showMessage({
          message: "Welcome! 🌍✈️",
          description: "Your travel assistant is ready to help",
          type: "info",
          icon: "info",
          duration: 2000,
        });
        
        setMessages([{ text, user: false }]);
      } catch (error) {
        console.error('Startup Error:', error);
      }
    };
    
    startChat();
  }, []);

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    
    setLoading(true);
    const userMessage = { text: userInput.trim(), user: true };
    setMessages(prevMessages => [userMessage, ...prevMessages]);

    try {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(GOOGLE_GERMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `As a knowledgeable travel assistant, provide concise and helpful advice for: ${userInput}`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      setMessages(prevMessages => [{ text, user: false }, ...prevMessages]);
    } catch (error) {
      console.error('Error:', error);
      showMessage({
        message: "Oops!",
        description: "Something went wrong. Please try again.",
        type: "danger",
        duration: 3000,
      });
    } finally {
      setLoading(false);
      setUserInput("");
    }
  };

  const renderMessage = ({ item }) => (
    <View 
      className={`px-4 py-3 rounded-2xl mb-3 ${
        item.user 
          ? 'bg-secondary self-end ml-12' 
          : 'bg-white self-start mr-12 shadow-sm'
      }`}
    >
      <Text 
        className={`${
          item.user ? 'text-white' : 'text-gray-800'
        } text-[15px] leading-5`}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={90}
      >
        <View className="flex-1 px-4">
          <View className="py-4 border-b border-gray-100">
            <Text className="text-xl font-semibold text-gray-800">Travel Assistant</Text>
          </View>

          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(_, index) => index.toString()}
            className="flex-1 pt-4"
            inverted
            showsVerticalScrollIndicator={false}
          />

          <View className="py-4 border-t border-gray-100">
            <View className="flex-row items-center bg-white rounded-2xl px-4 shadow-sm">
              <TextInput
                className="flex-1 py-3 text-gray-700"
                placeholder="Ask about your travel plans..."
                placeholderTextColor="#9CA3AF"
                value={userInput}
                onChangeText={setUserInput}
                onSubmitEditing={sendMessage}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                onPress={sendMessage}
                disabled={loading || !userInput.trim()}
                className={`ml-2 p-2 rounded-xl ${
                  loading || !userInput.trim() 
                    ? 'opacity-50' 
                    : 'opacity-100'
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="#367AFF" size="small" />
                ) : (
                  <Ionicons name="send" size={24} color="#367AFF" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default GeminiChat;