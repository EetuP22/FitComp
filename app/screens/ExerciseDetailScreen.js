import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import { Text, Button, Card, ActivityIndicator } from 'react-native-paper';
import { exerciseRepo } from '../repositories/exerciseRepo';
import { exerciseService } from '../services/exerciseService';

export default function ExerciseDetailScreen({ route, navigation }) {
  const { id } = route.params || {};
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [muscleMap, setMuscleMap] = useState(new Map());

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
      } catch (err) {
        console.error('ExerciseDetail load error', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!exercise) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Exercise not found</Text>
        <Button onPress={() => navigation.goBack()} style={{ marginTop: 12 }}>Close</Button>
      </View>
    );
  }

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

        <Card.Actions style={styles.actions}>
          <Button mode="contained" onPress={() => navigation.goBack()}>Close</Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

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
});