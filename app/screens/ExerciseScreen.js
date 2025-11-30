import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Searchbar, Chip, Card, Text, ActivityIndicator } from 'react-native-paper';
import { useExercise } from '../context/ExerciseProvider';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { exerciseRepo } from '../repositories/exerciseRepo';
import { exerciseService } from '../services/exerciseService';

export default function ExerciseScreen({ route }) {
  const { exercises, loading, error, searchExercises, searchByMuscle } = useExercise();
  const [query, setQuery] = useState('');
  const [muscles, setMuscles] = useState([]);
  const [muscleMap, setMuscleMap] = useState(new Map());
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const navigation = useNavigation();

  const selectionMode = route?.params?.selectionMode === true;
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

  useEffect(() => {
    const searchQuery = route?.params?.searchQuery;
    if (searchQuery) {
      setQuery(searchQuery);
      searchExercises({ search: searchQuery, page: 1, limit: 30 });
    }
  }, [route?.params?.searchQuery]);

  useEffect(() => {
    const autoOpenFirst = route?.params?.autoOpenFirst;
    if (autoOpenFirst && exercises.length > 0 && !loading) {
      const firstExercise = exercises[0];
      navigation.navigate('ExerciseDetail', { id: firstExercise.id });
      navigation.setParams({ autoOpenFirst: false });
    }
  }, [exercises, loading, route?.params?.autoOpenFirst]);

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
    if (selectionMode && typeof onSelectExercise === 'function') {
      onSelectExercise(exercise);
      navigation.setParams({ selectionMode: false, onSelectExercise: undefined });
      navigation.getParent()?.navigate('Programs');
      return;
    }
    navigation.navigate('ExerciseDetail', { id: exercise.id });
  };

 const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openDetail(item)}>
      <Card style={styles.card}>
        <View style={styles.cardRow}>
          {item.images?.length > 0 && (
            <Image 
              source={{ uri: item.images[0] }} 
              style={styles.thumbnail}
              resizeMode="cover"
            />
          )}
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
              <Text style={styles.selectHint}>Click to select</Text>
            )}
          </Card.Content>
        </View>
      </Card>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search exercises..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={onSearchSubmit}
        onClearIconPress={() => {
          setQuery('');
          searchExercises({ search: '', page: 1, limit: 30 });
          navigation.setParams({ searchQuery: undefined });
        }}
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
          ListEmptyComponent={<Text style={{ marginLeft: 12, color: '#999' }}>Loading...</Text>}
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
        <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>No exercises found</Text>
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
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  thumbnail: { width: 80, height: 80, borderTopLeftRadius: 12, borderBottomLeftRadius: 12, backgroundColor: '#eee' },
  cardContent: { flex: 1, paddingVertical: 12 },
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