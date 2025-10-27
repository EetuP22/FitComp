import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';

export default function ExerciseScreen() {
    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="Liikepankki" />
            </Appbar.Header>
            <View style={styles.content}>
                <Text style={styles.text}>REST API ja liikepankki tulossa myöhemmin...</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#fff' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 18, color: '#333'},
});