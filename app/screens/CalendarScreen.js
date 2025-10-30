import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import CustAppBar from '../components/CustAppBar';
import { Calendar } from 'react-native-calendars';
import { TextInput, Button, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';


export default function CalendarScreen() {
    const [selectedDate, setSelectedDate] = React.useState('');
    const [workoutName, setWorkoutName] = useState('');
    const [workouts, setWorkouts] = useState([]);
    const navigation = useNavigation();


    const addWorkout = () => {
        if (!selectedDate || !workoutName.trim() === '') return;
        const newWorkout = { date: selectedDate, name: workoutName.trim() };
        setWorkouts((prev) => [...prev, newWorkout]);
        setWorkoutName('');
    }

    const goToProgram = (workout) => {
        navigation.navigate('Programs', { workout });
    };


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
            <>
            <Text style={styles.text}>Valittu päivä: {selectedDate}</Text>

            <TextInput
                label="Treenin nimi"
                value={workoutName}
                onChangeText={setWorkoutName}
                mode='outlines'
                style={styles.input}
                />

            <Button mode="contained" onPress={addWorkout} style={styles.button}>
                Lisää treeni
            </Button>

             <FlatList
              data={workouts.filter((w) => w.date === selectedDate)}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Card style={styles.card}>
                  <Card.Title
                    title={item.name}
                    subtitle={`Päivä: ${item.date}`}
                    right={(props) => (
                      <Button
                        onPress={() => goToProgram(item)}
                        compact
                        mode="text"
                      >
                        Avaa
                      </Button>
                    )}
                  />
                </Card>
              )}
            />
          </>
        ) : (
          <Text style={styles.text}>Valitse päivä kalenterista 📅</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 16 },
  text: { fontSize: 18, color: '#333', marginBottom: 12 },
  input: { marginBottom: 10 },
  button: { marginBottom: 16 },
  card: { marginVertical: 6 },
});