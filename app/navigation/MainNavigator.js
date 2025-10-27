import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ProgramScreen from '../screens/ProgramScreen';
import ExerciseScreen from '../screens/ExerciseScreen';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: '#6200ee',
                    tabBarInactiveTintColor: 'gray',
                    tabBarStyle: { backgroundColor: '#fff' },
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="home" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Map"
                    component={MapScreen}
                    options={{
                        tabBarLabel: 'Map',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="map-marker" color={color} size={size} />
                        ),
                    }}      
                    />
                <Tab.Screen
                    name="Calendar"
                    component={CalendarScreen}
                    options={{
                        tabBarLabel: 'Calendar',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="calendar" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Programs"
                    component={ProgramScreen}
                    options={{
                        tabBarLabel: 'Programs',
                        tabBarIcon: ({ color, size }) => (  
                            <MaterialCommunityIcons name="dumbbell" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Exercises"
                    component={ExerciseScreen}
                    options={{
                        tabBarLabel: 'Exercises',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="weight-lifter" color={color} size={size} />
                        ),
                    }}
                />


            </Tab.Navigator>
        </NavigationContainer>
    );
}