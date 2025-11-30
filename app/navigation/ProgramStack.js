import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProgramScreen from '../screens/ProgramScreen';
import ProgramDetailScreen from '../screens/ProgramDetailScreen';
import DayDetailScreen from '../screens/DayDetailScreen';


const Stack = createStackNavigator();

export default function ProgramStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Takaisin',
      }}
    >
      <Stack.Screen
        name="ProgramsList"
        component={ProgramScreen}
        options={{ title: 'Training Programs' }}
      />
      <Stack.Screen
        name="ProgramDetail"
        component={ProgramDetailScreen}
        options={{ title: 'Program' }}
      />
      <Stack.Screen
        name="DayDetail"
        component={DayDetailScreen}
        options={{ title: 'Workout Day' }}
      />
    </Stack.Navigator>
  );
}
