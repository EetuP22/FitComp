import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import MainNavigator from './app/navigation/MainNavigator';
import { theme } from './app/styles/theme';
import { ProgramProvider } from './app/context/ProgramContext';
import { initDatabase } from './app/db/database';

export default function App() {
  useEffect(()=> {
    initDatabase();
  }, []);
  
  return (
    <PaperProvider theme={theme}>
      <ProgramProvider>
        <MainNavigator />
      </ProgramProvider>
    </PaperProvider>
  );
}
