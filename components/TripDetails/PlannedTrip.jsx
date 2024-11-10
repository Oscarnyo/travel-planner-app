import { View, Text, Image, TouchableOpacity, Linking, Modal } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { GOOGLE_MAPS_API_KEY } from '@env';
import PlaceCard from './PlaceCard';
import SearchLocation from '../../app/(screens)/SearchLocation'
import { router } from 'expo-router';
import CustomPlaceCard from '../CustomPlaceCard';

const PlannedTrip = ({details, tripDetails}) => {
    const [showOptions, setShowOptions] = useState(false);
    const [selectedDayIndex, setSelectedDayIndex] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [showSearchLocation, setShowSearchLocation] = useState(false);
    const [insertPosition, setInsertPosition] = useState('start');
    
    // // Add debug log
    // console.log("PlannedTrip received details:", details);
    
    if (!details || !Array.isArray(details)) {
        console.log("No valid details data");
        return null;
    }
    
    // Add button press handler
    const handleAddPress = (event, dayIndex, position = 'start') => {
        event.target.measure((x, y, width, height, pageX, pageY) => {
            setMenuPosition({ 
                x: pageX + 30,
                y: pageY - 148
            });
            setSelectedDayIndex(dayIndex);
            setInsertPosition(position); // Add this state variable
            requestAnimationFrame(() => {
                setShowOptions(true);
            });
        });
    };

    
    // Add OptionsPopup component
    const OptionsPopup = React.memo(({ visible, onClose, position }) => (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            animationType="fade"
            
        >
            <TouchableOpacity 
                style={{ flex: 1 }}
                onPress={onClose}
                activeOpacity={1}
            >
                <View 
                    className="absolute rounded-2xl p-2"
                    style={{
                        top: position.y,
                        left: position.x,             
                        width: 150,
                        backgroundColor: 'rgba(210, 215, 240, 0.9)', // Semi-transparent background
                        shadowColor: "#000",
                        shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                    }}
                >
                    <TouchableOpacity 
                        className="flex-row items-center p-3 rounded-lg mb-2"
                        style={{backgroundColor:'rgba(210, 215, 240, 0.78)'}}
                        onPress={() => {
                            setShowOptions(false);
                            router.push({
                                pathname: '/(screens)/SearchLocation',
                                params: { 
                                    tripId: tripDetails?.docId,
                                    dayIndex: selectedDayIndex,
                                    insertPosition: insertPosition
                                }
                            });
                        }}
                    >
                        <Ionicons name="location" size={20} color="#367AFF" />
                        <Text className="ml-2 font-bold text-[16px] text-gray-700">Add Place</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        className="flex-row items-center p-3 rounded-lg"
                        style={{backgroundColor:'rgba(210, 215, 240, 0.78)'}}
                        onPress={() => {}}
                    >
                        <Ionicons name="document-text" size={20} color="#367AFF" />
                        <Text className="ml-2 text-[16px] font-bold text-gray-700">Add Note</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    ));
    
    
    
    
    return (
        <View className='mt-8'>
            <View className='flex-row items-center mb-[-10px]'>
                <Ionicons name="reader" size={22} color="#367AFF" />
                <Text className='font-bold text-[20px]'> Itinerary Plan</Text>
            </View>
            
            {details.map((day, dayIndex) => (
                <View key={`day-${dayIndex}`}>
                    <View className='flex-row items-center mt-2 p-2 rounded-xl mb-1'>
                        <Text className='font-bold text-[22px] ml-[2px] mb-2 mt-2'>
                            {day.day}
                        </Text>
                    </View>
                    
                    <View className="ml-6 relative mb-4">
                        {/* Timeline line */}
                        <View className="absolute left-1 top-0 bottom-0 w-[2px] bg-[#367AFF]" />
                        
                        {/* Only show start timeline button if there are activities */}
                        {day.activities && day.activities.length > 0 && (
                            <TouchableOpacity
                                onPress={(event) => handleAddPress(event, dayIndex, 'start')}
                                className="absolute -left-[15px] top-[-5px] z-10"
                                activeOpacity={0.9}
                            >
                                <View className="bg-white rounded-full p-1">
                                    <Ionicons name="add-circle" size={30} color="#367AFF" />
                                </View>
                            </TouchableOpacity>
                        )}
    
                        {day.activities && day.activities.map((place, placeIndex) => (
                            <View key={`place-${dayIndex}-${placeIndex}`} className="relative mb-3">
                                {/* Timeline dot */}
                                <View className="absolute -left-[1px] top-[180px] z-10">
                                    <View className="w-[12px] h-[12px] rounded-full bg-[#367AFF]" />
                                </View>
                                
                                {/* Place card */}
                                <View className='ml-7 mb-1 mt-8 w-[350px]'>
                                    <View className='p-5 rounded-2xl bg-[#d2d7f0]'>
                                    {place.isManuallyAdded ? (
                                        <CustomPlaceCard
                                            place={place}
                                            tripId={tripDetails?.docId}
                                            dayIndex={dayIndex}
                                            placeIndex={placeIndex}
                                            tripDetails={details}
                                        />
                                    ) : (
                                        <PlaceCard
                                            place={place}
                                            tripId={tripDetails?.docId}
                                            dayIndex={dayIndex}
                                            placeIndex={placeIndex}
                                            tripDetails={details}
                                        />
                                    )}
                                    </View>
                                </View>
    
                                {/* Add button after each place card */}
                                <TouchableOpacity
                                    onPress={(event) => handleAddPress(event, dayIndex, placeIndex + 1)}
                                    className="absolute -left-[15px] bottom-[-38px] z-10"
                                    activeOpacity={0.9}
                                >
                                    <View className="bg-white rounded-full p-1">
                                        <Ionicons name="add-circle" size={30} color="#367AFF" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ))}
                        
                        {/* Single add button for empty day */}
                        {(!day.activities || day.activities.length === 0) && (
                            <TouchableOpacity
                                onPress={(event) => handleAddPress(event, dayIndex)}
                                className="absolute -left-[15px] top-[-8px] z-10"
                                activeOpacity={0.9}
                            >
                                <View className="bg-white rounded-full p-1">
                                    <Ionicons name="add-circle" size={30} color="#367AFF" />
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            ))}
            
            <OptionsPopup 
                visible={showOptions}
                onClose={() => setShowOptions(false)}
                position={menuPosition}
            />
            
        </View>
    );
};

export default PlannedTrip