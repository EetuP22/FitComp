import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Button, TextInput, Text } from 'react-native-paper';
import CustAppBar from '../components/CustAppBar';
import { useNavigation } from '@react-navigation/native';
import { useProgram } from '../context/ProgramContext';

export default function ProgramDetailScreen({ route }) {
    const { programId } = route.params;
    const { getProgramById, addDay, deleteDay } = useProgram();
    const  program  = getProgramById(programId);
    const [dayName, setDayName] = useState('');
    const navigation = useNavigation();

    if (!program) return <Text>Ohjelmaa ei löytynyt.</Text>;

  const handleAddDay = () => {
    if (!dayName.trim()) return;
    addDay(programId, dayName.trim());
    setDayName('');
  };

  const openDay = (dayId) => {
    navigation.navigate('DayDetail', { programId, dayId });
  };

  const renderDay = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title title={item.name} />
      <Card.Actions style={styles.cardActions}>
        <Button mode="outlined" onPress={() => openDay(item.id)}>
          Avaa
        </Button>
        <Button
          mode="text"
          textColor="#e53935"
          onPress={() => deleteDay(programId, item.id)}
        >
          Poista
        </Button>
      </Card.Actions>
    </Card>
  );


    return (
    <View style={styles.container}>
      <CustAppBar title={program.programName} />
      <View style={styles.content}>
        <Text style={styles.subtitle}>
          {program.programDesc || 'Ei kuvausta tälle ohjelmalle'}
        </Text>
        <TextInput
          label="Lisää treenipäivä (esim. Yläkroppa)"
          value={dayName}
          onChangeText={setDayName}
          mode="outlined"
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleAddDay}
          icon="plus"
          style={styles.button}
        >
          Lisää päivä
        </Button>
        <FlatList
          data={program.days || []}
          keyExtractor={(item) => item.id}
          renderItem={renderDay}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Ei vielä treenipäiviä.</Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 16 },
  subtitle: { fontSize: 16, marginBottom: 12, color: '#555' },
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