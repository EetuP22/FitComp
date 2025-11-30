import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Button, TextInput, Text, Divider } from 'react-native-paper';
import { useProgram } from '../context/ProgramProvider';
import { useNavigation } from '@react-navigation/native';

export default function DayDetailScreen({ route }) {
  const { programId, dayId } = route.params;
  const { getDayById, addExercise, deleteExercise } = useProgram();
  const navigation = useNavigation();
  const day = getDayById(programId, dayId);
  const [exerciseName, setExerciseName] = useState('');

  if (!day) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Virhe: Päivää ei löytynyt.</Text>
      </View>
    );
  }
  const handleAddExercise = async () => {
    if (!exerciseName.trim()) return;
    addExercise(programId, dayId, exerciseName.trim());
    setExerciseName('');
  };

  const handleBrowseLibrary = () => {
    // Navigate to exercise library in selection mode
    navigation.navigate('Exercises', {
      screen: 'ExerciseList',
      params: {
        selectionMode: true,
        onSelectExercise: (exercise) => {
          // Add selected exercise to this day
          addExercise(programId, dayId, exercise.name);
          // Navigate back
          navigation.goBack();
        }
      }
    });
  };

  const renderExercise = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title title={item.name} />
      <Card.Actions style={styles.cardActions}>
        <Button
          mode="text"
          textColor="#e53935"
          onPress={() => deleteExercise(programId, dayId, item.id)}
        >
          Poista
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
        <Text style={styles.title}>{day.name}</Text>
      <View style={styles.content}>
        <Text style={styles.subtitle}>Lisää harjoituksia tälle päivälle 🏋️</Text>
        
        {/* Browse Library Button */}
        <Button
          mode="contained"
          onPress={handleBrowseLibrary}
          icon="magnify"
          style={styles.button}
        >
          Selaa liikepankkia
        </Button>

        <Divider style={styles.divider} />
        <Text style={styles.orText}>tai kirjoita nimi manuaalisesti</Text>
        
        {/* Manual Input */}
        <TextInput
          label="Liikkeen nimi"
          value={exerciseName}
          onChangeText={setExerciseName}
          mode="outlined"
          style={styles.input}
        />
        <Button
          mode="outlined"
          onPress={handleAddExercise}
          icon="plus"
          style={styles.button}
        >
          Lisää liike
        </Button>
        <FlatList
          data={day.exercises || []}
          keyExtractor={(item) => item.id}
          renderItem={renderExercise}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Ei vielä harjoituksia. Lisää yllä!</Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fafafa',
  },
  content: { flex: 1, padding: 16 },
  subtitle: { fontSize: 16, marginBottom: 12, color: '#555' },
  divider: { marginVertical: 16 },
  orText: { 
    textAlign: 'center', 
    color: '#999', 
    fontSize: 14, 
    marginVertical: 12,
    fontStyle: 'italic'
  },
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
