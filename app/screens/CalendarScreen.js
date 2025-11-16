import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, ScrollView } from 'react-native';
import CustAppBar from '../components/CustAppBar';
import { Calendar } from 'react-native-calendars';
import { Button, Card, TextInput, Snackbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useProgram } from '../context/ProgramContext';

export default function CalendarScreen() {
    const [selectedDate, setSelectedDate] = React.useState('');
    const [ modalVisible, setModalVisible ] = useState(false);
    const [ note, setNote ] = useState('');
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    

    const navigation = useNavigation();
    const { programs, getAssignedDay, assignDayToDate, selectedDays, deleteCalendarEntry, markCalendarEntryAsDone, updateCalendarNotes } = useProgram();

    useEffect(() => {
      if (!selectedDate) {
        setNote('');
        return;
      }
      const assigned = getAssignedDay(selectedDate);
      setNote(assigned?.notes ?? '');
    }, [selectedDate, selectedDays]);

    const assigned = selectedDate ? getAssignedDay(selectedDate) : null;
    const isDone = selectedDate && selectedDays[selectedDate]
      ? selectedDays[selectedDate].done === 1 || selectedDays[selectedDate].done === true
      : false;

    const openDay = () => {
      if (!assigned) return;
      navigation.navigate('DayDetailModal', {
        programId: assigned.programId,
        dayId: assigned.dayId,
      });
    };

    const handleDeleteCalendarLog = async () => {
        if (!assigned) return;
        await deleteCalendarEntry(selectedDate);
        setSelectedDate('');
        setNote('');
        setSnackbarMessage('Kalenterimerkintä poistettu!');
        setSnackbarVisible(true);
    };

    const handleMarkDayAsDone = async () => {
        if (!selectedDate) return;
        await markCalendarEntryAsDone(selectedDate);
        setSnackbarMessage('Treeni merkitty tehdyksi! ✅');
        setSnackbarVisible(true);
        
    };

    const handleSaveNote = async () => {
        if (!selectedDate) return;
        await updateCalendarNotes(selectedDate, note);
        setSnackbarMessage('Muistiinpanot tallennettu!');
        setSnackbarVisible(true);
    };

    const onSelectProgramDay = async (date, programId, dayId) => {
        await assignDayToDate(date, programId, dayId);
        setModalVisible(false);
        const assignedNow = getAssignedDay(date);
        setNote(assignedNow?.notes ?? '');
    };

  return (
    <View style={styles.container}>
      <CustAppBar title="Treenikalenteri" />

      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
            [selectedDate]: {selected: true, selectedColor: '#2196f3'},
        }}
        theme={{
            todayTextColor: '#e91e63',
            arrowColor: '#2196f3',
        }}
        style={styles.calendar}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!selectedDate ? (
          <Text style={styles.text}>Valitse päivä kalenterista 📅</Text>
        ) : assigned ? (
          <>
            <Text style={styles.text}>Tälle päivälle on liitetty treenipäivä ✅</Text>

            <Button mode="contained" onPress={openDay} icon="dumbbell" style={styles.button}>
              Avaa liitetty treeni
            </Button>

            <Button
              mode="contained"
              onPress={handleMarkDayAsDone}
              icon="check-circle"
              buttonColor={isDone ? '#4CAF50' : undefined} 
              style={styles.button}
            >
              {isDone ? 'Treeni merkitty tehdyksi ✅' : 'Merkitse treeni tehdyksi'}
            </Button>
                      

            <TextInput
             label="Lisää muistiinpano"
             value={note}
             onChangeText={setNote}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={3}
            />

            <Button mode="outlined" onPress={handleSaveNote} style={styles.button} icon="content-save">
              Tallenna muistiinpano
            </Button>

            <Button mode="text" onPress={handleDeleteCalendarLog} textColor="#e53935" style={styles.deleteButton} icon="trash-can">
              Poista liitetty treeni
            </Button>
          </>
        ) : (
          <>
            <Text style={styles.text}>Ei liitettyä treeniä. Valitse ohjelmapäivä:</Text>

            <Button mode="contained" onPress={() => setModalVisible(true)} style={styles.button} icon="plus-circle">
              Valitse ohjelmapäivä
            </Button>
          </>
        )}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.text}>Valitse ohjelmapäivä:</Text>

              <FlatList
              data={programs.flatMap((p) =>
                p.days.map((d) => ({ ...d, programId: p.id, programName: p.name }))
              )}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Card style={styles.card}>
                  <Card.Title
                    title={`${item.programName} — ${item.name}`}
                    right={() => (
                      <Button
                        onPress={async() => {
                          await onSelectProgramDay(selectedDate, item.programId, item.id);
                        }}
                      >
                        Valitse
                      </Button>
                    )}
                  />
                </Card>
              )}
            />

            <Button mode="text" onPress={() => setModalVisible(false)} icon="close">
              Sulje
            </Button>
          </View>
        </View>
      </Modal>
      <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
      >
          {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  calendar: {marginHorizontal: 0},
  content: { flex: 1, padding: 16, paddingTop: 8 },
  text: { fontSize: 18, color: '#333', marginBottom: 12, fontWeight: '500' },
  input: { marginBottom: 12 },
  button: { marginBottom: 10, paddingVertical: 6 },
  doneButton: { backgroundColor: '#4CAF50' },
  deleteButton: { marginTop: 16, marginBottom: 20, paddingVertical: 6 },
  card: { marginVertical: 6 },
  modal: {flex: 1, justifyContent: 'center', backgroundColor: '#00000055'},
  modalContent: {backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 8, maxHeight: '80%'},
});