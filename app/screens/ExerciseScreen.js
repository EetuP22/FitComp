import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Searchbar, Chip, Card, Text, ActivityIndicator } from 'react-native-paper';
import { useExercise } from '../context/ExerciseProvider';
import { useNavigation } from '@react-navigation/native';
import { exerciseService } from '../services/exerciseService';

export default function ExerciseScreen() {
  const { exercises, loading, error, searchExercises, searchByMuscle } = useExercise();
  const [query, setQuery] = useState('');
  const [muscles, setMuscles] = useState([]);
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    searchExercises({ search: '', page: 1, limit: 30 });
    (async () => {
      try {
        const m = await exerciseService.fetchMuscles();
        setMuscles(m);
      } catch (e) {
      }
    })();
  }, []);

  const onSearchSubmit = () => {
    searchExercises({ search: query, page: 1, limit: 30 });
  };

  const onSelectMuscle = (m) => {
    const val = selectedMuscle === m.id ? null : m.id;
    setSelectedMuscle(val);
    if (val) searchByMuscle(val);
    else searchExercises({ search: '', page: 1, limit: 30 });
  };

  const openDetail = (exercise) => {
    navigation.navigate('ExerciseDetail', { id: exercise.id });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openDetail(item)}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subtitle}>
            {item.muscles && item.muscles.length > 0 ? `Muscles: ${item.muscles.join(', ')}` : ''}
          </Text>
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
        />
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" />
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12 }}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Ei liikkeitä</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  search: { margin: 12 },
  chipsRow: { paddingHorizontal: 12, paddingBottom: 6 },
  chip: { marginRight: 8 },
  card: { marginBottom: 10 },
  cardContent: { paddingVertical: 12 },
  title: { fontSize: 16, fontWeight: '600' },
  subtitle: { fontSize: 12, color: '#666', marginTop: 6 },
});