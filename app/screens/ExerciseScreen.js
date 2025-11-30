import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Searchbar, Chip, Card, Text, ActivityIndicator } from 'react-native-paper';
import { useExercise } from '../context/ExerciseProvider';
import { useNavigation } from '@react-navigation/native';
import { exerciseRepo } from '../repositories/exerciseRepo';
import { exerciseService } from '../services/exerciseService';

export default function ExerciseScreen({ route }) {
  const { exercises, loading, error, searchExercises, searchByMuscle } = useExercise();
  const [query, setQuery] = useState('');
  const [muscles, setMuscles] = useState([]);
  const [muscleMap, setMuscleMap] = useState(new Map());
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const navigation = useNavigation();

  // Check if we're in selection mode
  const selectionMode = route?.params?.selectionMode || false;
  const onSelectExercise = route?.params?.onSelectExercise;

 useEffect(() => {
    searchExercises({ search: '', page: 1, limit: 30 });
    (async () => {
      try {
        const m = await exerciseService.fetchMuscles();
        setMuscles(m);
        setMuscleMap(new Map(m.map(mm => [Number(mm.id), mm.name])));
      } catch (e) {
        console.warn('Failed to load muscles', e);
      }
    })();
  }, []);

  const onSearchSubmit = () => {
    if (query.trim()) {
      searchExercises({ search: query, page: 1, limit: 30 });
    }
  };

  const onSelectMuscle = (m) => {
    const val = selectedMuscle === m.id ? null : m.id;
    setSelectedMuscle(val);
    if (val) {
      searchByMuscle(val);
    } else {
      searchExercises({ search: '', page: 1, limit: 30 });
    }
  };

  const openDetail = (exercise) => {
    // If in selection mode, call the callback
    if (selectionMode && onSelectExercise) {
      onSelectExercise(exercise);
    } else {
      // Normal mode: navigate to detail
      navigation.navigate('ExerciseDetail', { id: exercise.id });
    }
  };

 const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openDetail(item)}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Text style={styles.title} numberOfLines={2}>
            {item.name}
          </Text>
          {item.muscles?.length > 0 && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {item.muscles.map((m) => muscleMap.get(Number(m)) || m).join(', ')}
            </Text>
          )}
          {selectionMode && (
            <Text style={styles.selectHint}>Napauta valitaksesi</Text>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Hae liikkeitä..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={onSearchSubmit}
        style={styles.search}
      />
      <View style={styles.chipsRow}>
        <FlatList
          horizontal
          data={muscles}
          keyExtractor={(m) => String(m.id)}
          renderItem={({ item }) => (
            <Chip
              selected={selectedMuscle === item.id}
              onPress={() => onSelectMuscle(item)}
              style={styles.chip}
            >
              {item.name}
            </Chip>
          )}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={<Text style={{ marginLeft: 12, color: '#999' }}>Ladataan...</Text>}
        />
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" />
      ) : exercises.length > 0 ? (
        <FlatList
          data={exercises}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12 }}
        />
      ) : (
        <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>Ei liikkeitä löytynyt</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  search: { margin: 12 },
  chipsRow: { paddingHorizontal: 12, paddingBottom: 6, maxHeight: 60 },
  chip: { marginRight: 8 },
  card: { marginBottom: 10 },
  cardContent: { paddingVertical: 12 },
  title: { fontSize: 16, fontWeight: '600', color: '#212121' },
  subtitle: { fontSize: 12, color: '#666', marginTop: 6 },
  selectHint: { 
    fontSize: 12, 
    color: '#1E88E5', 
    marginTop: 8, 
    fontWeight: '600',
    fontStyle: 'italic'
  },
});