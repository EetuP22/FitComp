import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import CustAppBar from '../components/CustAppBar';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import { useProgram } from '../context/ProgramContext';


export default function ProgramScreen({ navigation}) {
  const { programs, addProgram, deleteProgram } = useProgram();
    const [ programName, setProgramName ] = useState('');
    const [ programDesc, setProgramDesc ] = useState('');


      const handleAddProgram = () => {
    if (programName.trim() === '') return;
    addProgram(programName, programDesc);
    setProgramName('');
    setProgramDesc('');
  };

  const openProgram = (program) => {
    navigation.navigate('ProgramDetail', { program });
  };

  const renderProgram = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title title={item.name} subtitle={item.desc || 'Ei kuvausta'} />
      <Card.Actions style={styles.cardActions}>
        <Button mode="outlined" onPress={() => openProgram(item)}>Avaa</Button>
        <Button mode="text" onPress={() => deleteProgram(item.id)} textColor="#e53935">Poista</Button>
      </Card.Actions>
    </Card>
  );
     return (
    <View style={styles.container}>
      <CustAppBar title="Treeniohjelmat" />
      <View style={styles.content}>
        <Text style={styles.text}>Luo uusi ohjelma 🏋️‍♂️</Text>

        <TextInput label="Ohjelman nimi" value={programName} onChangeText={setProgramName} mode='outlined' style={styles.input} />
        <TextInput label="Kuvaus" value={programDesc} onChangeText={setProgramDesc} mode='outlined' style={styles.input} />
        <Button mode="contained" onPress={handleAddProgram} style={styles.button} icon="plus">Lisää ohjelma</Button>

        <FlatList
          data={programs}
          keyExtractor={(item) => item.id}
          renderItem={renderProgram}
          ListEmptyComponent={<Text style={styles.emptyText}>Ei ohjelmia vielä.</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 16 },
  input: { marginBottom: 10 },
  button: { marginBottom: 20 },
  card: { marginBottom: 10, elevation: 2 },
  cardActions: { justifyContent: 'flex-end', paddingRight: 8, paddingBottom: 8 },
  emptyText: { textAlign: 'center', color: '#777', marginTop: 20 },
  text: { fontSize: 16, marginBottom: 12 },
});
