import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import MainNavigator from './app/navigation/MainNavigator';

export default function App() {
  return (
    <PaperProvider>
      <MainNavigator />
    </PaperProvider>
  );
}
