import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustAppBar from '../components/CustAppBar';
import { Calendar } from 'react-native-calendars';


export default function CalendarScreen() {
    const [selectedDate, setSelectedDate] = React.useState('');


  return (
    <View style={styles.container}>
      <CustAppBar title="Treenikalenteri" />
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
            [selectedDate]: {selected: true, selectedColor: '#2196f3'},
        }}
        theme={{
            todayTextColor: '#e91e63',
            arrowColor: '#2196f3',
        }}
      />

      <View style={styles.content}>
        {selectedDate ? (
            <Text style={styles.text}>Valittu päivä: {selectedDate}</Text>
        ) : (
            <Text style={styles.text}>Valitse päivä kalenterista 📅</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#fff' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 18, color: '#333'},
});