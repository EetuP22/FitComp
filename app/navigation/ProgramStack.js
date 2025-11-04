import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProgramScreen from '../screens/ProgramScreen';
import ProgramDetailScreen from '../screens/ProgramDetailScreen';
import DayDetailScreen from '../screens/DayDetailScreen';

const Stack = createStackNavigator();

export default function ProgramStack() {
    return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ProgramsList" component={ProgramScreen} />
        <Stack.Screen name="ProgramDetail" component={ProgramDetailScreen} />
        <Stack.Screen name="DayDetail" component={DayDetailScreen} />
    </Stack.Navigator>
    );
}