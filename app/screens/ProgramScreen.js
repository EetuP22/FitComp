import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import CustAppBar from '../components/CustAppBar';
import { Text, TextInput, Button, Card } from 'react-native-paper';



export default function ProgramScreen() {
    const [ programs, setPrograms ] = useState([]);
    const [ programName, setProgramName ] = useState('');
    const [ programDesc, setProgramDesc ] = useState('');


    const addProgram = () => {
        if (programName.trim() === '') return;

        const newProgram = {
            id: Date.now().toString(),
            programName,
            programDesc,
        };

        setPrograms([...programs, newProgram]);
        setProgramName('');
        setProgramDesc('');
    };

    const renderProgram = ({ item }) => (
        <Card style={styles.card}>
            <Card.Title title={item.programName}
                subtitle={item.programDesc} />
        </Card>
    );

     return (
    <View style={styles.container}>
      <CustAppBar title="Treeniohjelmat" />
      <View style={styles.content}>
        <Text style={styles.text}>Luo uusi ohjelma 🏋️‍♂️</Text>
        <TextInput
            label="Ohjelman nimi"
            value={programName}
            onChangeText={setProgramName}
            mode='outlined'
            style={styles.input}
        />

        <TextInput
            label="Ohjelman kuvaus(valinnainen)"
            value={programDesc}
            onChangeText={setProgramDesc}
            mode='outlined'
            style={styles.input}
        />

        <Button
            mode="contained"
            onPress={addProgram}
            style={styles.button}
            icon="plus"
        >
            Lisää ohjelma
        </Button>

        <Text style={styles.header}>Treeniohjelmat:</Text>

        <FlatList
            data={programs}
            keyExtractor={(item) => item.id}
            renderItem={renderProgram}
            ListEmptyComponent={
                <Text style={styles.emptyText}>
                    Ei vielä ohjelmia - lisää ensimmäinen!
                </Text>
            }
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 16 },
  header: { fontSize: 18, fontWeight: 'bold', marginVertical: 12 },
  input: { marginBottom: 10 },
  button: { marginBottom: 20 },
  card: { marginBottom: 10, elevation: 2 },
  emptyText: { textAlign: 'center', color: '#777', marginTop: 20 },
});