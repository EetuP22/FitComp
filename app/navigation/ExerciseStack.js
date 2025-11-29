import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ExerciseScreen from '../screens/ExerciseScreen';
import ExerciseDetailScreen from '../screens/ExerciseDetailScreen';

const Stack = createStackNavigator();

export default function ExerciseStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="ExerciseList" component={ExerciseScreen} options={{ title: 'Liikepankki' }} />
      <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} options={{ title: 'Liike' }} />
    </Stack.Navigator>
  );
}