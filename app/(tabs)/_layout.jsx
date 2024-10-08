import { View, Text, Image, ViewBase } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router';

import { icons } from '../../constants';

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
           
            let iconSource;

            if (route.name === 'planner') {
              iconSource = icons.home;
            } else if (route.name === 'explore') {
              iconSource = icons.explore;
            } else if (route.name === 'map') {
              iconSource = icons.map;
            } else if (route.name === 'expense') {
              iconSource = icons.expense;
            } else if (route.name === 'profile') {
              iconSource = icons.profile;
            }

            return (
              <Image
                source={iconSource}
                resizeMode='contain'
                style={{ width: 30, height: 30, tintColor: focused ? '#020619' : 'gray'}}
              />
            );
          },
          tabBarActiveTintColor: '#020619',
          tabBarInactiveTintColor: 'grey',
          tabBarStyle:{ 
            height: 60,
            paddingTop: 5,
            paddingBottom: 5,
            backgroundColor: '#E5E8F8',
          },
          tabBarLabelStyle: {
            fontWeight: 'bold',
            fontSize: 12,
            
          },
        })}
      >
        <Tabs.Screen 
          name="planner" 
          options={{
            title: 'Home',
            headerShown: false,
          }}
        />
        <Tabs.Screen 
          name="explore"
          options={{
            title: 'Explore',
            headerShown: false,
          }}
        />
        <Tabs.Screen 
          name="map"
          options={{
            title: 'Map',
            headerShown: false,
          }}
        />
        <Tabs.Screen 
          name="expense"
          options={{
            title: 'Expense',
            headerShown: false,
          }}
        />
        <Tabs.Screen 
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
          }}
        />
      </Tabs>
    </>
  )
}

export default TabsLayout;