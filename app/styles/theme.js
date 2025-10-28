import { MD3LightTheme as DefaultTheme } from "react-native-paper";

export const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#1E88E5',
        secondary: '#D81B60',
        background: '#F5F5F5',
        surface: '#FFFFFF',
        text: '#212121',
        placeholder: '#9E9E9E',
    },
    roundness: 10,
};