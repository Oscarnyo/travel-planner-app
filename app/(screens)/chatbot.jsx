import { GOOGLE_GERMINI_API_KEY } from '@env';
import * as GoogleGenerativeAI from "@google/generative-ai";
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { showMessage } from "react-native-flash-message";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);

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
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    const userMessage = { text: inputText.trim(), user: true };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');

    try {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(GOOGLE_GERMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `As a knowledgeable travel assistant, provide concise and helpful advice for: ${inputText}`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      setMessages(prevMessages => [...prevMessages, { text, user: false }]);
    } catch (error) {
      console.error('Error:', error);
      showMessage({
        message: "Oops!",
        description: "Something went wrong. Please try again.",
        type: "danger",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View 
      className={`p-3 rounded-xl max-w-[80%] mb-4 ${
        item.user 
          ? 'bg-secondary self-end' 
          : 'bg-white self-start'
      }`}
    >
      <Text 
        className={`${
          item.user 
            ? 'text-white' 
            : 'text-gray-800'
        }`}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-backBlue">
      <View className="flex-1 px-4 mb-4">
        <View className="flex-row items-center py-4">
          <Text className="text-2xl font-bold flex-1">Travel Assistant</Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(_, index) => index.toString()}
          className="flex-1"
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          onLayout={() => flatListRef.current?.scrollToEnd()}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={100}
        >
          <View className="flex-row items-center pb-4 pt-2">
            <TextInput
              className="flex-1 bg-white rounded-xl px-4 py-2 mr-2"
              placeholder="Type your message..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              onPress={sendMessage}
              disabled={isLoading || !inputText.trim()}
              className={`p-3 rounded-xl ${
                isLoading || !inputText.trim() 
                  ? 'bg-gray-300' 
                  : 'bg-secondary'
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Ionicons name="send" size={24} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default ChatBot;