import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import MainNavigator from './app/navigation/MainNavigator';
import { theme } from './app/styles/theme';


export default function App() {
  return (
    <PaperProvider theme={theme}>
      <MainNavigator />
    </PaperProvider>
  );
}
