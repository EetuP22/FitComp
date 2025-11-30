import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Text, TextInput, Button, Card, Snackbar } from 'react-native-paper';
import { useProgram } from '../context/ProgramProvider';


export default function ProgramScreen({ navigation}) {
  const { programs, deleteProgram, addProgram, loading, error } = useProgram();
  const [ programName, setProgramName ] = useState('');
  const [ programDesc, setProgramDesc ] = useState('');

   

    const handleAddProgram = () => {
      if (programName.trim() === '') return;
      addProgram(programName, programDesc);
      setProgramName('');
      setProgramDesc('');
    };

    const handleDeleteProgram = (programId) => {
      deleteProgram(programId);
    }

  const openProgram = (programId) => {
    navigation.navigate('ProgramDetail', { programId });
  };


  const renderProgram = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title title={item.name} subtitle={item.desc || 'No description'} />
      <Card.Actions style={styles.cardActions}>
        <Button mode="outlined" onPress={() => openProgram(item.id)}>
          Open
        </Button>
        <Button mode="text" onPress={() => handleDeleteProgram(item.id)} textColor="#e53935">
          Delete
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color= '#1E88E5' />  
      </View>
    )
  }
     return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>Create new program 🏋️‍♂️</Text>

        <TextInput 
        label="Program name" 
        value={programName} 
        onChangeText={setProgramName} 
        mode='outlined' 
        style={styles.input} 
        />
        <TextInput 
        label="Description" 
        value={programDesc} 
        onChangeText={setProgramDesc} 
        mode='outlined' 
        style={styles.input} 
        />
        <Button 
        mode="contained" 
        onPress={handleAddProgram} 
        style={styles.button} 
        icon="plus"
        >
          Add Program
        </Button>

        <FlatList
          data={programs}
          keyExtractor={(item) => item.id}
          renderItem={renderProgram}
          ListEmptyComponent={<Text style={styles.emptyText}>No programs yet.</Text>}
        />
      </View>
      
      <Snackbar
        visible={!!error}
        onDismiss={() => {}}
        duration={3000}
      >
        {error}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center'},
  content: { flex: 1, padding: 16 },
  input: { marginBottom: 10 },
  button: { marginBottom: 20 },
  card: { marginBottom: 10, elevation: 2 },
  cardActions: { justifyContent: 'flex-end', paddingRight: 8, paddingBottom: 8 },
  emptyText: { textAlign: 'center', color: '#777', marginTop: 20 },
  text: { fontSize: 16, marginBottom: 12 },
});
