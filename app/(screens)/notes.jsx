import { View, Text, TextInput, ScrollView, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'

const Notes = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const params = useLocalSearchParams()
  const { tripId, dayIndex, insertPosition } = params

  const handleSave = async () => {
    try {
      const tripRef = doc(db, "users", tripId);
      const tripDoc = await getDoc(tripRef);
      const tripData = tripDoc.data();
      const updatedDailyPlan = [...tripData.tripPlan.daily_plan];

      const newNote = {
        type: 'note',
        title,
        content,
        timestamp: new Date().toISOString()
      };

      if (!updatedDailyPlan[dayIndex].activities) {
        updatedDailyPlan[dayIndex].activities = [];
      }

      if (insertPosition === 'start') {
        updatedDailyPlan[dayIndex].activities.unshift(newNote);
      } else {
        updatedDailyPlan[dayIndex].activities.splice(insertPosition, 0, newNote);
      }

      await updateDoc(tripRef, {
        tripPlan: {
          ...tripData.tripPlan,
          daily_plan: updatedDailyPlan
        }
      });

      router.back();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-backBlue p-4">
    <ScrollView>
      <View className="mt-24">
        <Text className="text-gray-700 text-[16px] font-bold mb-2">Title</Text>
        <TextInput
          className="border border-gray-300 rounded-xl p-3 text-[16px]"
          placeholder="Enter note title"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View className="mt-6">
        <Text className="text-gray-700 text-[16px] font-bold mb-2">Content</Text>
        <TextInput
          className="border border-gray-300 rounded-xl p-3 min-h-[200px] text-[16px]"
          placeholder="Write your note here..."
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
      </View>

      <CustomButton
        title="Save Note"
        handlePress={handleSave}
        containerStyles="w-full h-[55px] mt-5"
      />
    </ScrollView>
    </SafeAreaView>
  )
}

export default Notes