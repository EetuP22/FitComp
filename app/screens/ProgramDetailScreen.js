import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Button, TextInput, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useProgram } from '../context/ProgramProvider';
import { useCalendar } from '../context/CalendarProvider';

// Näkymä valitun ohjelman yksityiskohdille
export default function ProgramDetailScreen({ route }) {
    const { programId } = route.params;
    const { getProgramById, addDay, deleteDay } = useProgram();
    const { deleteCalendarEntryByDayId } = useCalendar();
    const  program  = getProgramById(programId);
    const [dayName, setDayName] = useState('');
    const navigation = useNavigation();

    if (!program) return <Text>Program not found.</Text>;

    // Käsittele päivän lisääminen
  const handleAddDay = () => {
    if (!dayName.trim()) return;
    addDay(programId, dayName.trim());
    setDayName('');
  };

  // Käsittele päivän poistaminen
  const handleDeleteDay = async (dayId) => {
    await deleteCalendarEntryByDayId(dayId);
    await deleteDay(programId, dayId);
  }

  // Avaa päivän yksityiskohdat
  const openDay = (dayId) => {
    navigation.navigate('DayDetail', { programId, dayId });
  };

  // Renderöi päivän kortin
  const renderDay = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title title={item.name} />
      <Card.Actions style={styles.cardActions}>
        <Button mode="outlined" onPress={() => openDay(item.id)}>
          Open
        </Button>
        <Button
          mode="text"
          textColor="#e53935"
          onPress={() => handleDeleteDay(item.id)}
        >
          Delete
        </Button>
      </Card.Actions>
    </Card>
  );


  // Päärenderöinti
    return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.subtitle}>
          {program.desc || 'No description for this program'}
        </Text>
        <TextInput
          label="Add workout day (e.g. Upper Body)"
          value={dayName}
          onChangeText={setDayName}
          mode="outlined"
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleAddDay}
          icon="plus"
          style={styles.button}
        >
          Add Day
        </Button>
        <FlatList
          data={program.days || []}
          keyExtractor={(item) => item.id}
          renderItem={renderDay}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No workout days yet.</Text>
          }
        />
      </View>
    </View>
  );
}

// Tyylit
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 16 },
  subtitle: { fontSize: 16, marginBottom: 12, color: '#555' },
  input: { marginBottom: 10 },
  button: { marginBottom: 20 },
  card: { marginBottom: 10, elevation: 2 },
  cardActions: {
    justifyContent: 'flex-end',
    paddingRight: 8,
    paddingBottom: 8,
  },
  emptyText: { textAlign: 'center', color: '#777', marginTop: 20 },
});