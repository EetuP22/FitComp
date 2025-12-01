import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Card, Snackbar } from 'react-native-paper';
import { useWorkoutLog } from '../context';

export default function LogWorkoutScreen({ route, navigation }) {
  const { exerciseId, exerciseName } = route.params || {};
  const { addWorkoutLog } = useWorkoutLog();
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSubmit = async () => {
    if (!exerciseName) {
      setSnackbarMessage('Exercise name is required');
      setSnackbarVisible(true);
      return;
    }

    if (!date) {
      setSnackbarMessage('Date is required');
      setSnackbarVisible(true);
      return;
    }

    const parsedSets = sets ? parseInt(sets, 10) : null;
    const parsedReps = reps ? parseInt(reps, 10) : null;
    const parsedWeight = weight ? parseFloat(weight) : null;

    setLoading(true);
    try {
      await addWorkoutLog(
        exerciseId || null,
        exerciseName,
        date,
        parsedSets,
        parsedReps,
        parsedWeight,
        notes
      );
      
      setSnackbarMessage('Workout logged successfully!');
      setSnackbarVisible(true);
      
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error) {
      setSnackbarMessage('Error logging workout');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Log Workout</Text>
            <Text style={styles.exerciseName}>{exerciseName || 'Unknown Exercise'}</Text>
            
            <TextInput
              label="Date (YYYY-MM-DD)"
              value={date}
              onChangeText={setDate}
              mode="outlined"
              style={styles.input}
              placeholder="2024-01-01"
            />
            
            <TextInput
              label="Sets"
              value={sets}
              onChangeText={setSets}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
              placeholder="3"
            />
            
            <TextInput
              label="Reps"
              value={reps}
              onChangeText={setReps}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
              placeholder="10"
            />
            
            <TextInput
              label="Weight (kg)"
              value={weight}
              onChangeText={setWeight}
              mode="outlined"
              keyboardType="decimal-pad"
              style={styles.input}
              placeholder="50.0"
            />
            
            <TextInput
              label="Notes (optional)"
              value={notes}
              onChangeText={setNotes}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
              placeholder="How did it feel?"
            />
            
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={styles.button}
              icon="check"
            >
              Log Workout
            </Button>
            
            <Button
              mode="text"
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              Cancel
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 16 },
  card: { elevation: 2 },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E88E5',
    marginBottom: 20,
  },
  input: { marginBottom: 12 },
  button: { marginTop: 8, marginBottom: 12 },
});
