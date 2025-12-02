import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import { Text, Button, Card, ActivityIndicator, Divider } from 'react-native-paper';
import { exerciseRepo } from '../repositories/exerciseRepo';
import { exerciseService } from '../services/exerciseService';
import { useWorkoutLog } from '../context';

// Näkymä harjoituksen yksityiskohdille
export default function ExerciseDetailScreen({ route, navigation }) {
  const { id, returnTo, programId, dayId } = route.params || {};
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [muscleMap, setMuscleMap] = useState(new Map());
  const [exerciseLogs, setExerciseLogs] = useState([]);
  const { getLogsByExercise } = useWorkoutLog();

  // Käsittele sulkeminen ja navigointi takaisin edelliseen näkymään
  const handleClose = () => {
    if (returnTo === 'DayDetail' && programId && dayId) {
      navigation.navigate('Programs', {
        screen: 'DayDetail',
        params: { programId, dayId }
      });
    } else {
      navigation.goBack();
    }
  };

  // Lataa harjoituksen tiedot ja siihen liittyvät lokit
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!id) return;
        const e = await exerciseRepo.getExerciseById(id);
        if (!mounted) return;
        setExercise(e);
        const m = await exerciseService.fetchMuscles();
        setMuscleMap(new Map(m.map(mm => [Number(mm.id), mm.name])));
        
        const logs = await getLogsByExercise(e.name);
        if (mounted) {
          setExerciseLogs(logs.slice(0, 3));
        }
      } catch (err) {
        console.error('ExerciseDetail load error', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, getLogsByExercise]);

  // Renderöi latausindikaattori tai harjoituksen tiedot
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Renderöi virheilmoitus, jos harjoitusta ei löydy
  if (!exercise) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Exercise not found</Text>
        <Button onPress={handleClose} style={{ marginTop: 12 }}>Close</Button>
      </View>
    );
  }

  // Päärenderöinti
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>{exercise.name}</Text>
          {exercise.description && (
            <Text style={styles.desc}>{exercise.description}</Text>
          )}
        </Card.Content>

        {exercise.images && exercise.images.length > 0 && (
          <View style={styles.imagesContainer}>
            <Text style={styles.imagesTitle}>Images:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesRow}>
              {exercise.images.map((uri, idx) => (
                <Image key={idx} source={{ uri }} style={styles.image} />
              ))}
            </ScrollView>
          </View>
        )}

        <Card.Content>
          {exercise.muscles && exercise.muscles.length > 0 && (
            <Text style={styles.info}>
              💪 Muscles: {exercise.muscles.map(m => muscleMap.get(Number(m)) || m).join(', ')}
            </Text>
          )}
          {exercise.equipment && exercise.equipment.length > 0 && (
            <Text style={styles.info}>🛠️ Equipment: {exercise.equipment.join(', ')}</Text>
          )}
        </Card.Content>

        {exerciseLogs.length > 0 && (
          <View>
            <Divider style={{ marginVertical: 16 }} />
            <Card.Content>
              <Text style={styles.title}>Recent Workouts</Text>
              {exerciseLogs.map((log, idx) => (
                <View key={log.id} style={styles.logItem}>
                  <Text style={styles.logDate}>{log.date}</Text>
                  <View style={styles.logDetails}>
                    {log.sets && <Text style={styles.logDetail}>{log.sets} sets</Text>}
                    {log.reps && <Text style={styles.logDetail}>× {log.reps} reps</Text>}
                    {log.weight && <Text style={styles.logDetail}>@ {log.weight} kg</Text>}
                  </View>
                  {log.notes && <Text style={styles.logNotes}>📝 {log.notes}</Text>}
                  {idx < exerciseLogs.length - 1 && <Divider style={{ marginTop: 8 }} />}
                </View>
              ))}
            </Card.Content>
            <Card.Actions style={styles.actions}>
              <Button 
                mode="outlined" 
                onPress={() => navigation.navigate('Progress')}
              >
                View Full History
              </Button>
            </Card.Actions>
          </View>
        )}

        <Card.Actions style={styles.actions}>
          <Button mode="contained" onPress={handleClose}>Close</Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

// Tyylit
const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#fff' },
  card: { marginBottom: 20, elevation: 2 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8, color: '#212121' },
  desc: { color: '#666', marginBottom: 12, fontSize: 14, lineHeight: 20 },
  imagesContainer: { paddingHorizontal: 16, paddingBottom: 12 },
  imagesTitle: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  imagesRow: { flexDirection: 'row' },
  image: { width: 200, height: 150, marginRight: 12, borderRadius: 8, backgroundColor: '#eee' },
  info: { fontSize: 14, color: '#555', marginBottom: 6 },
  actions: { justifyContent: 'flex-end', paddingTop: 12 },
  logItem: { paddingVertical: 8 },
  logDate: { fontSize: 12, color: '#666', marginBottom: 4 },
  logDetails: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', marginBottom: 4 },
  logDetail: { fontSize: 14, color: '#555', fontWeight: '500' },
  logNotes: { fontSize: 12, color: '#666', fontStyle: 'italic' },
});