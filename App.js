import React, { useEffect, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import MainNavigator from './app/navigation/MainNavigator';
import { theme } from './app/styles/theme';
import { ProgramProvider } from './app/context/ProgramContext';
import { initDatabase } from './app/db/database';
import { View, ActivityIndicator } from 'react-native';

export default function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const initDb = async () => {
      await initDatabase();
      setDbReady(true);
    };
    initDb();
  }, []);

  if (!dbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1E88E5" />
      </View>
    );
  }
  
  return (
    <PaperProvider theme={theme}>
      <ProgramProvider>
        <MainNavigator />
      </ProgramProvider>
    </PaperProvider>
  );
}