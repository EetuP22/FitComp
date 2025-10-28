import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustAppBar from '../components/CustAppBar';


export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <CustAppBar title="FitComp" />
      <View style={styles.content}>
        <Text style={styles.text}>Tervetuloa FitComp-sovellukseen 💪</Text>
        <Text style={styles.subtext}>Valitse toiminto alavalikosta aloittaaksesi</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#fff' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 18, marginBottom: 8, fontWeight: '600'},
    subtext: { fontSize: 16, color: '#666' },
});