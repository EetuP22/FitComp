import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import { Text, Button, Card, ActivityIndicator } from 'react-native-paper';
import { exerciseRepo } from '../repositories/exerciseRepo';

export default function ExerciseDetailScreen({ route, navigation }) {
  const { id } = route.params || {};
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!id) return;
        const e = await exerciseRepo.getExerciseById(id);
        if (!mounted) return;
        setExercise(e);
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

  const stripHtml = (html = '') => (html ? html.replace(/<[^>]*>/g, '').trim() : '');

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
        <Text>Liikettä ei löytynyt</Text>
        <Button onPress={() => navigation.goBack()} style={{ marginTop: 12 }}>Sulje</Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Card.Content>
          <Text style={styles.title}>{exercise.name}</Text>
          <Text style={styles.desc}>{stripHtml(exercise.description || '')}</Text>
        </Card.Content>

        {exercise.images && exercise.images.length > 0 && (
          <ScrollView horizontal style={styles.imagesRow} showsHorizontalScrollIndicator={false}>
            {exercise.images.map((uri) => (
              <Image key={uri} source={{ uri }} style={styles.image} />
            ))}
          </ScrollView>
        )}

        <Card.Content>
          {exercise.muscles && exercise.muscles.length > 0 && (
            <Text style={{ marginBottom: 8 }}>Lihakset: {exercise.muscles.join(', ')}</Text>
          )}
          {exercise.equipment && exercise.equipment.length > 0 && (
            <Text style={{ marginBottom: 8 }}>Välineet: {exercise.equipment.join(', ')}</Text>
          )}
        </Card.Content>

        <Card.Actions>
          <Button onPress={() => navigation.goBack()}>Sulje</Button>
          <Button mode="contained" onPress={() => {/* Lisää ohjelmaan: toteutus vaiheessa 2 */}}>
            Lisää ohjelmaan
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  desc: { color: '#444', marginBottom: 12 },
  imagesRow: { padding: 12 },
  image: { width: 200, height: 140, marginRight: 10, borderRadius: 8 },
});