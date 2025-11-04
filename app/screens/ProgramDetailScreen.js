import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Button, TextInput, Text } from 'react-native-paper';
import CustAppBar from '../components/CustAppBar';
import { useNavigation } from '@react-navigation/native';

export default function ProgramDetailScreen({ route }) {
    const { program } = route.params;
    const [days, setDays] = useState([]);
    const [dayName, setDayName] = useState('');
    const navigation = useNavigation();

    const addDay = () => {
        if (dayName.trim() === '') return;

        const newDay = {
            id: Date.now().toString(),
            name: dayName.trim(),
            exercises: [], //Myöhempää varten
        };

        setDays([...days, newDay]);
        setDayName('');
    };

    const deleteDay = (id) => {
        setDays(days.filter((d) => d.id !== id));
    };

    const openDay = (day) => {
        navigation.navigate('DayDetail', { day });
    };

    const renderDay = ({ item }) => (
        <Card style={styles.card}>
            <Card.Title title={item.name} />
            <Card.Actions style={styles.cardActions}>
                <Button mode='outlined' onPress={() => openDay(item)}>
                    Avaa
                </Button>
                <Button mode='text' textColor='#e53935' onPress={() => deleteDay(item.id)}>
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
                    label='Lisää treenipäivä (esim. Yläkroppa)'
                    value={dayName}
                    onChangeText={setDayName}
                    mode='outlined'
                    style={styles.input}
                />

                <Button
                    mode='contained'
                    onPress={addDay}
                    icon="plus"
                    style={styles.button}
                >
                    Lisää päivä
                </Button>

                <FlatList
                    data={days}
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
