import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, ProgressBar, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useProgram } from '../context/ProgramProvider';
import { useCalendar } from '../context/CalendarProvider';
import { useWorkoutLog } from '../context';
import CustAppBar from '../components/CustAppBar';
import { gymRepo } from '../repositories/gymRepo';

// Näkymä kotisivulle
export default function HomeScreen() {
  const navigation = useNavigation();
  const { programs } = useProgram();
  const { selectedDays } = useCalendar();
  const { workoutLogs } = useWorkoutLog();
  const [ favoriteGyms, setFavoriteGyms ] = React.useState([]);

  // Hae suosikkikuntosalit käynnistyksen yhteydessä
  React.useEffect(() => {
    (async () => {
      const saved = await gymRepo.getAllFavoriteGyms();
      setFavoriteGyms(saved);
    })();
  }, []);

  // Nykyinen päivä merkkijonona
const today = new Date().toISOString().split('T')[0];

// Nykyisen päivän harjoitusvalinta
const todayTraining = selectedDays[today];
  const todayDay = useMemo(() => {
    if (!todayTraining) return null;
    for (const program of programs) {
      const day = program.days.find((d) => d.id === todayTraining.dayId);
      if (day) return { ...day, programName: program.name };
    }
    return null;
  }, [programs, selectedDays, today]);


  // Viikon tilastot
  const weeklyStats = useMemo(() => {
    const stats = {
      total: 0,
      completed: 0,
      days: [],
    };

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const entry = selectedDays[dateStr];
      if (entry) {
        stats.total++;
        if (entry.done) {
          stats.completed++;
        }
        stats.days.push({ date: dateStr, done: entry.done });
      }
    }

    return stats;
  }, [selectedDays]);

  // Viikon suoritusprosentti
  const completionRate =
    weeklyStats.total > 0 ? (weeklyStats.completed / weeklyStats.total) * 100 : 0;

  // Viimeisin treeniloki
  const latestWorkout = useMemo(() => {
    if (!workoutLogs || workoutLogs.length === 0) return null;
    return workoutLogs[0];
  }, [workoutLogs]);

  // Navigoi kalenteriin
  const navigateToCalendar = () => {
    navigation.navigate('Calendar');
  };

  // Navigoi ohjelmiin
  const navigateToPrograms = () => {
    navigation.navigate('Programs');
  };

  // Navigoi suosikkikuntosaleihin kartalla(Todellisuudessa kuntosalikartan perusnäkymä)
  const navigateToFavoriteGyms = () => {
    navigation.navigate('Map', { showFavorites: true });  
  };

  const favoriteGymsCount = favoriteGyms.length;

  // Päärenderöinti
  return (
    <View style={styles.container}>
      <CustAppBar title="FitComp - Your Fitness Companion" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.welcomeText}>Welcome to your fitness companion! 💪</Text>
        <Text style={styles.subtitle}>
          {todayTraining ? "You have a workout today!" : "No workout today."}
        </Text>

        {todayDay ? (
          <Card style={styles.card}>
            <Card.Title
              title="Today"
              subtitle={todayDay.programName}
              left={() => <Text style={styles.emoji}>📅</Text>}
            />
            <Card.Content>
              <Text style={styles.dayName}>{todayDay.name}</Text>
              <Text style={styles.exerciseCount}>
                {todayDay.exercises?.length || 0} exercises
              </Text>
              {todayTraining.done && (
                <Text style={styles.completedText}>✅ Marked as done</Text>
              )}
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() =>
                  navigation.navigate('Calendar', {
                    screen: 'DayDetailModal',
                    params: {
                    programId: todayTraining.programId,
                    dayId: todayTraining.dayId,
                    },
                  })
                }
              >
                Open
              </Button>
              <Button mode="text" onPress={navigateToCalendar}>
                Calendar
              </Button>
            </Card.Actions>
          </Card>
        ) : (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.noTrainingText}>
                No training assigned today. Select a program day from the calendar!
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button mode="contained" onPress={navigateToCalendar}>
                Go to calendar
              </Button>
            </Card.Actions>
          </Card>
        )}

        <Divider style={styles.divider} />

        <Text style={styles.sectionTitle}>Weekly Summary 📊</Text>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Completed</Text>
                <Text style={styles.statValue}>{weeklyStats.completed}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total</Text>
                <Text style={styles.statValue}>{weeklyStats.total}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Rate</Text>
                <Text style={styles.statValue}>{Math.round(completionRate)}%</Text>
              </View>
            </View>

            <Text style={styles.progressLabel}>Completion rate</Text>
            <ProgressBar
              progress={completionRate / 100}
              color={completionRate >= 70 ? '#4CAF50' : '#FF9800'}
              style={styles.progressBar}
            />
          </Card.Content>
        </Card>

        <Divider style={styles.divider} />

        {latestWorkout && (
          <>
            <Text style={styles.sectionTitle}>Latest Workout 🏋️</Text>
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.dayName}>{latestWorkout.exercise_name}</Text>
                <Text style={styles.exerciseCount}>
                  {latestWorkout.date}
                </Text>
                <View style={styles.statsRow}>
                  {latestWorkout.sets && (
                    <Text style={styles.logDetail}>{latestWorkout.sets} sets</Text>
                  )}
                  {latestWorkout.reps && (
                    <Text style={styles.logDetail}>× {latestWorkout.reps} reps</Text>
                  )}
                  {latestWorkout.weight && (
                    <Text style={styles.logDetail}>@ {latestWorkout.weight} kg</Text>
                  )}
                </View>
              </Card.Content>
              <Card.Actions>
                <Button mode="text" onPress={() => navigation.navigate('Progress')}>
                  View All
                </Button>
              </Card.Actions>
            </Card>
            <Divider style={styles.divider} />
          </>
        )}

        <Text style={styles.sectionTitle}>Quick Actions ⚡</Text>
        <View style={styles.quickActionsGrid}>
          <Card style={styles.quickActionCard}>
            <Card.Content style={styles.quickActionContent}>
              <Text style={styles.quickActionEmoji}>📊</Text>
              <Text style={styles.quickActionText}>Progress</Text>
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <Button mode="text" onPress={() => navigation.navigate('Progress')} compact>
                Open
              </Button>
            </Card.Actions>
          </Card>

          <Card style={styles.quickActionCard}>
            <Card.Content style={styles.quickActionContent}>
              <Text style={styles.quickActionEmoji}>📅</Text>
              <Text style={styles.quickActionText}>Calendar</Text>
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <Button mode="text" onPress={navigateToCalendar} compact>
                Open
              </Button>
            </Card.Actions>
          </Card>

          <Card style={styles.quickActionCard}>
            <Card.Content style={styles.quickActionContent}>
              <Text style={styles.quickActionEmoji}>🗺️</Text>
              <Text style={styles.quickActionText}>Gym Map</Text>
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <Button mode="text" onPress={navigateToFavoriteGyms} compact>
                Open
              </Button>
            </Card.Actions>
          </Card>



          <Card style={styles.quickActionCard}>
            <Card.Content style={styles.quickActionContent}>
              <Text style={styles.quickActionEmoji}>🏋️</Text>
              <Text style={styles.quickActionText}>Programs</Text>
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <Button mode="text" onPress={navigateToPrograms} compact>
                Open
              </Button>
            </Card.Actions>
          </Card>
        </View>

        <View style={styles.spacing} />
      </ScrollView>
    </View>
  );
}

// Tyylit
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { flex: 1, padding: 16 },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 24,
    marginRight: 8,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  cardActions: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  dayName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E88E5',
    marginBottom: 8,
  },
  exerciseCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  completedText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  noTrainingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 12,
  },
  divider: {
    marginVertical: 20,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    gap: 12,
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E88E5',
  },
  logDetail: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 8,
  },
  quickActionCard: {
    flex: 1,
    minWidth: '45%',
    elevation: 2,
    justifyContent: 'space-between',
  },
  quickActionContent: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    minHeight: 80,
    justifyContent: 'center',
  },
  quickActionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#212121',
    textAlign: 'center',
  },
  spacing: {
    height: 40,
  },
});