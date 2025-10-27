import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './app/screens/HomeScreen';
import MapScreen from './app/screens/MapScreen';
import CalendarScreen from './app/screens/CalendarScreen';
import ProgramScreen from './app/screens/ProgramScreen';
import ExerciseScreen from './app/screens/ExerciseScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Map" component={MapScreen} />
          <Stack.Screen name="Calendar" component={CalendarScreen} />
          <Stack.Screen name="Programs" component={ProgramScreen} />
          <Stack.Screen name="Exercises" component={ExerciseScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
