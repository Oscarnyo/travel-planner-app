import { View, Text, Image, TouchableOpacity, Linking, Modal } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { GOOGLE_MAPS_API_KEY } from '@env';
import PlaceCard from './PlaceCard';

const PlannedTrip = ({details, tripDetails}) => {
    const [showOptions, setShowOptions] = useState(false);
    const [selectedDayIndex, setSelectedDayIndex] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    
    // Add debug log
    console.log("PlannedTrip received details:", details);
    
    if (!details || !Array.isArray(details)) {
        console.log("No valid details data");
        return null;
    }
    
    const handleAddPress = (event, dayIndex) => {
        // Get the button position in the window
        event.target.measure((x, y, width, height, pageX, pageY) => {
            setMenuPosition({ 
                x: pageX - 130, // Position menu to the left of the button
                y: pageY - 15 // Position menu below the button
            });
            setSelectedDayIndex(dayIndex);
            setShowOptions(true);
        });
    };

    
    const OptionsPopup = React.memo(({ visible, onClose, position }) => (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            animationType="none"
            
        >
            <TouchableOpacity 
                style={{ flex: 1 }}
                onPress={onClose}
                activeOpacity={1}
            >
                <View 
                    className="absolute rounded-xl p-2"
                    style={{
                        top: position.y,
                        left: position.x,
                        width: 150,
                        backgroundColor: 'rgba(210, 215, 240, 0.88)', // Semi-transparent background
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                        borderWidth: 1,
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                    }}
                >
                    <TouchableOpacity 
                        className="flex-row items-center p-3 bg-white/10 rounded-lg mb-1"
                        onPress={() => {}}
                    >
                        <Ionicons name="location" size={20} color="#367AFF" />
                        <Text className="ml-2 font-bold text-[16px] text-gray-700">Add Place</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        className="flex-row items-center p-3 bg-white/10 rounded-lg"
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
            <View className='flex-row items-center'>
                <Ionicons name="reader" size={22} color="#367AFF" />
                <Text className='font-bold text-[20px]'> Itinerary Plan</Text>
            </View>
            
            {details.map((day, dayIndex) => (
                <View key={`day-${dayIndex}`}>
                    <View className='flex-row items-center justify-between mt-2 p-2 rounded-xl mb-1'>
                        <Text className='font-bold text-[22px] ml-[2px] self-center'>
                            {day.day}
                        </Text>
                        
                        <TouchableOpacity
                            onPress={(event) => handleAddPress(event, dayIndex)}
                            className='self-center mt-[3px]'
                        >
                            <Ionicons name="add-circle" size={34} color="#367AFF" />
                        </TouchableOpacity>
                    </View>
                    
                    {day.activities && day.activities.map((place, placeIndex) => (
                        <View key={`place-${dayIndex}-${placeIndex}`} className='p-[17] rounded-2xl mb-5 bg-[#d2d7f0]'>
                            <PlaceCard
                                place={place}
                                tripId={tripDetails?.docId}
                                dayIndex={dayIndex}
                                placeIndex={placeIndex}
                                tripDetails={details}
                            />
                        </View>
                    ))}
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