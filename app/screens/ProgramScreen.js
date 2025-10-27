import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';

export default function ProgramScreen() {
    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="Treeniohjelmat" />
            </Appbar.Header>
            <View style={styles.content}>
                <Text style={styles.text}>Harjoitusohjelmien hallinta tulossa myöhemmin...</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#fff' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 18, color: '#333'},
});