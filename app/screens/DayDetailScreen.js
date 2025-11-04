import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Button, TextInput, Text } from 'react-native-paper';
import CustAppBar from '../components/CustAppBar';

export default function ProgramScreen({ route }) {
    const { day } = route.params;
    const [exercises, setExercises] = useState([]);
    const [exerciseName, setExerciseName] = useState('');

    const addExercise = () => {
        if (exerciseName.trim() === '') return;

        const newExercise = {
            id: Date.now().toString(),
            name: exerciseName.trim(),
        };

        setExercises([...exercises, newExercise]);
        setExerciseName('');
    };

    const deleteExercise = (id) => {
        setExercises(exercises.filter((e) => e.id !== id));
    };

     const renderExercise = ({ item }) => (
            <Card style={styles.card}>
                <Card.Title title={item.name} />
                <Card.Actions style={styles.cardActions}>
                    <Button mode='text' textColor='#e53935' onPress={() => deleteExercise(item.id)}>
                        Poista
                    </Button>
                </Card.Actions>
            </Card>
        );

        return (
            <View style={styles.container}>
                <CustAppBar title={day.name} />
                <View style={styles.content}>
                    <Text style={styles.subtitle}>Lisää harjoituksia tälle päivälle 🏋️</Text>

                    <TextInput
                        label='Liikeen nimi'
                        value={exerciseName}
                        onChangeText={setExerciseName}
                        mode='outlined'
                        style={styles.input}
                    />

                    <Button
                        mode='contained'
                        onPress={addExercise}
                        icon='plus'
                        style={styles.button}
                    >
                        Lisää liike
                    </Button>

                    <FlatList
                        data={exercises}
                        keyExtractor={(item) => item.id}
                        renderItem={renderExercise}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>Ei vielä harjoituksia. Lisää yllä!</Text>
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
    emptyText: { textAlign: 'center', color: '#777', marginTop: 20
    },

});