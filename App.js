import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import MainNavigator from './app/navigation/MainNavigator';
import { theme } from './app/styles/theme';
import { ProgramProvider } from './app/context/ProgramContext';


export default function App() {
  return (
    <PaperProvider theme={theme}>
      <ProgramProvider>
        <MainNavigator />
      </ProgramProvider>
    </PaperProvider>
  );
}
