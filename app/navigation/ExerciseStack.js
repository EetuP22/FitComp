import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ExerciseScreen from '../screens/ExerciseScreen';
import ExerciseDetailScreen from '../screens/ExerciseDetailScreen';

const Stack = createStackNavigator();

export default function ExerciseStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen 
        name="ExerciseList" 
        component={ExerciseScreen} 
        options={({ route, navigation }) => ({ 
          title: 'Exercise Library',
          headerLeft: route?.params?.selectionMode ? () => (
            <TouchableOpacity 
              onPress={() => {
                navigation.setParams({ selectionMode: false, onSelectExercise: undefined });
                navigation.getParent()?.navigate('Programs');
              }} 
              style={{ marginLeft: 16 }}
            >
              <Ionicons name="arrow-back" size={24} color="#1E88E5" />
            </TouchableOpacity>
          ) : undefined
        })} 
      />
      <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} options={{ title: 'Exercise' }} />
    </Stack.Navigator>
  );
}