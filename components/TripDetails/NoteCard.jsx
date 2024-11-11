import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import { router } from 'expo-router'

const NoteCard = ({ note, tripId, dayIndex, noteIndex, tripDetails }) => {
  
  const handleEdit = () => {
    router.push({
      pathname: '/(screens)/notes',
      params: { 
        tripId,
        dayIndex,
        noteIndex,
        isEditing: true,
        title: note.title,
        content: note.content
      }
    });
  };
  
  
  const handleDelete = async () => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const updatedDailyPlan = [...tripDetails];
              updatedDailyPlan[dayIndex].activities.splice(noteIndex, 1);
              
              const tripRef = doc(db, "users", tripId);
              const currentData = await getDoc(tripRef);
              const tripData = currentData.data();
              
              await updateDoc(tripRef, {
                tripPlan: {
                  ...tripData.tripPlan,
                  daily_plan: updatedDailyPlan
                }
              });
            } catch (error) {
              console.error("Error deleting note:", error);
              Alert.alert("Error", "Failed to delete note");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View>
      <View className="flex-row justify-between items-start">
        <Text className="font-bold text-[18px] text-gray-800 flex-1">
          {note.title}
        </Text>
        
        <TouchableOpacity 
            onPress={handleEdit}
            className="p-1 mb-2"
        >
            <Ionicons name="pencil" size={20} color="#367AFF" />
        </TouchableOpacity>
        
      </View>
      
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-600 text-[14px] leading-5">
          {note.content}
        </Text>
        <TouchableOpacity 
          onPress={handleDelete}
          className="p-1"
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default NoteCard