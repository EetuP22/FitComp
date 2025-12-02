import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, FlatList, Alert } from 'react-native';
import { Text, Card, ActivityIndicator, Chip, Divider, Button } from 'react-native-paper';
import { useWorkoutLog } from '../context';

// Näkymä edistymiselle ja harjoituslokille
export default function ProgressScreen() {
  const { workoutLogs, loading, deleteWorkoutLog } = useWorkoutLog();
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Laske tilastotiedot harjoituslokista
  const stats = useMemo(() => {
    if (!workoutLogs || workoutLogs.length === 0) {
      return {
        totalWorkouts: 0,
        uniqueExercises: 0,
        last7Days: 0,
      };
    }

    // Laske kokonaismäärä, uniikit harjoitukset ja viimeiset 7 päivää
    const uniqueExercises = new Set(workoutLogs.map(log => log.exercise_name));
    
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    
    const last7Days = workoutLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= sevenDaysAgo && logDate <= now;
    }).length;

    // Palauta tilastot
    return {
      totalWorkouts: workoutLogs.length,
      uniqueExercises: uniqueExercises.size,
      last7Days,
    };
  }, [workoutLogs]);

  // Ryhmittele harjoitukset harjoitusnimen mukaan
  const exerciseGroups = useMemo(() => {
    if (!workoutLogs || workoutLogs.length === 0) return [];

    const groups = {};
    workoutLogs.forEach(log => {
      if (!groups[log.exercise_name]) {
        groups[log.exercise_name] = [];
      }
      groups[log.exercise_name].push(log);
    });

    // Muunna ryhmät taulukoksi
    return Object.entries(groups).map(([name, logs]) => ({
      name,
      count: logs.length,
      logs: logs.sort((a, b) => new Date(b.date) - new Date(a.date)),
    }));
  }, [workoutLogs]);

  // Suodata lokit valitun harjoituksen mukaan
  const filteredLogs = useMemo(() => {
    if (!selectedExercise) return workoutLogs || [];
    return workoutLogs.filter(log => log.exercise_name === selectedExercise);
  }, [workoutLogs, selectedExercise]);

  const sortedLogs = useMemo(() => {
    return [...filteredLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [filteredLogs]);

  // Määritä edistymisindikaattori viimeisimpien lokien perusteella
  const getProgressIndicator = (logs) => {
    if (logs.length < 2) return null;
    
    const recent = logs[0];
    const previous = logs[1];
    
    if (!recent.weight || !previous.weight) return null;
    
    if (recent.weight > previous.weight) return '📈';
    if (recent.weight < previous.weight) return '📉';
    return '➡️';
  };

  // Renderöi latausindikaattori
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text style={{ marginTop: 12 }}>Loading workout history...</Text>
      </View>
    );
  }

  // Päärenderöinti
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Card style={styles.statsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Workout Statistics</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.totalWorkouts}</Text>
                <Text style={styles.statLabel}>Total Workouts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.uniqueExercises}</Text>
                <Text style={styles.statLabel}>Exercises</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.last7Days}</Text>
                <Text style={styles.statLabel}>Last 7 Days</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {exerciseGroups.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Filter by Exercise</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.chipScroll}
              >
                <Chip
                  selected={!selectedExercise}
                  onPress={() => setSelectedExercise(null)}
                  style={styles.chip}
                >
                  All ({workoutLogs?.length || 0})
                </Chip>
                {exerciseGroups.map((group) => (
                  <Chip
                    key={group.name}
                    selected={selectedExercise === group.name}
                    onPress={() => setSelectedExercise(group.name)}
                    style={styles.chip}
                  >
                    {group.name} ({group.count})
                  </Chip>
                ))}
              </ScrollView>
            </Card.Content>
          </Card>
        )}

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>
              Recent Workouts
              {selectedExercise && ` - ${selectedExercise}`}
            </Text>
            {sortedLogs.length === 0 ? (
              <Text style={styles.emptyText}>
                No workout logs yet. Start logging your workouts!
              </Text>
            ) : (
              <FlatList
                data={sortedLogs}
                scrollEnabled={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => {
                  const exerciseLogs = exerciseGroups.find(
                    g => g.name === item.exercise_name
                  )?.logs || [];
                  const progressIcon = getProgressIndicator(exerciseLogs);
                  
                  return (
                    <View>
                      {index > 0 && <Divider style={styles.divider} />}
                      <View style={styles.logItem}>
                        <View style={styles.logHeader}>
                          <Text style={styles.logExercise}>{item.exercise_name}</Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {progressIcon && (
                              <Text style={styles.progressIcon}>{progressIcon}</Text>
                            )}
                            <Button
                              mode="text"
                              compact
                              textColor="#e53935"
                              onPress={() => {
                                Alert.alert(
                                  'Delete Workout Log',
                                  `Delete workout log for ${item.exercise_name} on ${item.date}?`,
                                  [
                                    { text: 'Cancel', style: 'cancel' },
                                    { 
                                      text: 'Delete', 
                                      style: 'destructive',
                                      onPress: () => deleteWorkoutLog(item.id)
                                    }
                                  ]
                                );
                              }}
                            >
                              Delete
                            </Button>
                          </View>
                        </View>
                        <Text style={styles.logDate}>{item.date}</Text>
                        <View style={styles.logDetails}>
                          {item.sets && (
                            <Text style={styles.logDetail}>
                              {item.sets} sets
                            </Text>
                          )}
                          {item.reps && (
                            <Text style={styles.logDetail}>
                              × {item.reps} reps
                            </Text>
                          )}
                          {item.weight && (
                            <Text style={styles.logDetail}>
                              @ {item.weight} kg
                            </Text>
                          )}
                        </View>
                        {item.notes && (
                          <Text style={styles.logNotes}>📝 {item.notes}</Text>
                        )}
                      </View>
                    </View>
                  );
                }}
              />
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

// Tyylit
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1 },
  statsCard: { margin: 16, marginBottom: 8, elevation: 2, marginTop: 40 },
  card: { marginHorizontal: 16, marginVertical: 8, elevation: 2 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E88E5',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  chipScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  chip: {
    marginRight: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    paddingVertical: 20,
  },
  logItem: {
    paddingVertical: 12,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  logExercise: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    flex: 1,
  },
  progressIcon: {
    fontSize: 20,
    marginLeft: 8,
  },
  logDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  logDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  logDetail: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  logNotes: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  divider: {
    marginVertical: 8,
  },
});
