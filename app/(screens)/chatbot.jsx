import { GOOGLE_GERMINI_API_KEY } from '@env';
import * as GoogleGenerativeAI from "@google/generative-ai";
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { showMessage } from "react-native-flash-message";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatBot = forwardRef(({ isModal = false, onClearChat }, ref) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);
  
  useImperativeHandle(ref, () => ({
    clearChat
  }));

   // Load saved messages when component mounts
   useEffect(() => {
    const loadMessages = async () => {
      try {
        const savedMessages = await AsyncStorage.getItem('chatMessages');
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        } else {
          // If no saved messages, start new chat
          startChat();
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        startChat(); // Fallback to new chat if loading fails
      }
    };
    loadMessages();
  }, []);

  // Save messages whenever they change
  useEffect(() => {
    const saveMessages = async () => {
      try {
        await AsyncStorage.setItem('chatMessages', JSON.stringify(messages));
      } catch (error) {
        console.error('Error saving messages:', error);
      }
    };
    if (messages.length > 0) {
      saveMessages();
    }
  }, [messages]);

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

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    
    Keyboard.dismiss();
    setIsLoading(true);
    const userMessage = { text: inputText.trim(), user: true };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
  
    try {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(GOOGLE_GERMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `As a knowledgeable travel assistant, provide advice for: ${inputText}.
      Format your response with proper spacing and structure:
          
      1. Start with a clear title in CAPS, followed by two newlines
      2. Each section should have:
         - A bold section header (use **Header:**)
         - A newline after each header 
         - Bullet points with • symbol
         - Bold key terms (use **term**)
         - Two newlines between sections
          
      Example format:
      **PARIS TRAVEL GUIDE**
          
      **Best Time to Visit:**
      • **Peak Season**: April to October
      • **Off Season**: November to March
          
      **Local Transportation:**
      • **Metro**: Efficient and covers major attractions
      • **Bus**: Comprehensive network, slower but scenic
          
      Keep responses concise and well-formatted.`;
      
      const result = await model.generateContent(prompt);
      let text = result.response.text();
      
      // Basic cleanup while preserving formatting
      text = text
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/`/g, '')
        .replace(/\[(.*?)\]\((.*?)\)/g, '$1');
      
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
      className={`px-4 py-3 rounded-2xl mb-3 ${
        item.user 
          ? 'bg-secondary self-end ml-12' 
          : 'bg-white self-start mr-12 shadow-sm'
      }`}
    >
      <Text 
        className={`${
          item.user 
            ? 'text-white' 
            : 'text-gray-800'
        } text-[15px] leading-6`}
      >
        {item.text}
      </Text>
    </View>
  );
  
  const clearChat = async () => {
    try {
      await AsyncStorage.removeItem('chatMessages');
      setMessages([]);
      startChat(); // Restart chat with initial greeting
      if (onClearChat) onClearChat(); // Call the parent's callback if provided
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  return (
    <View className={`flex-1 bg-backBlue ${isModal ? 'pt-0' : 'pt-4'}`}>
      <View className="flex-1 px-4 mb-4">
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(_, index) => index.toString()}
          className="flex-1"
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          onLayout={() => flatListRef.current?.scrollToEnd()}
          showsVerticalScrollIndicator={false}
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
    </View>
  );
});

export default ChatBot;