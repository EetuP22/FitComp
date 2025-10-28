import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustAppBar from '../components/CustAppBar';


export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <CustAppBar title="Treenikalenteri" />
      <View style={styles.content}>
        <Text style={styles.text}>Kalenterinäkymä kehitteillä 📅</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#fff' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 18, color: '#333'},
});