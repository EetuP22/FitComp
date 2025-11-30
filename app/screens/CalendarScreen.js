import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, ScrollView } from 'react-native';
import CustAppBar from '../components/CustAppBar';
import { Calendar } from 'react-native-calendars';
import { Button, Card, TextInput, Snackbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useProgram } from '../context/ProgramProvider';
import { useCalendar } from '../context/CalendarProvider';

export default function CalendarScreen() {
    const [selectedDate, setSelectedDate] = React.useState('');
    const [ modalVisible, setModalVisible ] = useState(false);
    const [ note, setNote ] = useState('');
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

  const [marking, setMarking] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const [localIsDone, setLocalIsDone] = useState(false);
    

    const navigation = useNavigation();
    const { programs } = useProgram();
    const {
      getAssignedDay,
      assignDayToDate,
      selectedDays,
      deleteCalendarEntry,
      deleteCalendarEntryByDayId,
      markCalendarEntryAsDone,
      updateCalendarNotes,
    } = useCalendar();

    useEffect(() => {
      if (!selectedDate) {
        setNote('');
        return;
      }
    const assigned = getAssignedDay(selectedDate);
    setNote(assigned?.notes ?? '');
    setLocalIsDone(Boolean(assigned?.done === 1 || assigned?.done === true));
  }, [selectedDate, selectedDays]);

  const assigned = selectedDate ? getAssignedDay(selectedDate) : null;
  const isDone = localIsDone;

    const openDay = () => {
      if (!assigned) return;
      navigation.navigate('DayDetailModal', {
        programId: assigned.programId,
        dayId: assigned.dayId,
      });
    };

    const handleDeleteCalendarLog = async () => {
        if (!assigned) return;
        setDeleting(true);
        try {
          await deleteCalendarEntry(selectedDate);
          setSelectedDate('');
          setNote('');
          setSnackbarMessage('Calendar entry deleted!');
          setSnackbarVisible(true);
      } finally {
        setDeleting(false);
      }
     };

    const handleMarkDayAsDone = async () => {
        if (!selectedDate) return;
        setLocalIsDone(true);
        setMarking(true);
        try {
          await markCalendarEntryAsDone(selectedDate);
          setSnackbarMessage('Training marked as done! ✅');
          setSnackbarVisible(true);
      } finally {
        setMarking(false);
      }
    };

    const handleSaveNote = async () => {
        if (!selectedDate) return;
        setSavingNote(true);
        try {
          await updateCalendarNotes(selectedDate, note);
          setSnackbarMessage('Notes saved!');
          setSnackbarVisible(true);
      } finally {
        setSavingNote(false);
      }
    };

    const onSelectProgramDay = async (date, programId, dayId) => {
      setAssigning(true);
      try {
        await assignDayToDate(date, programId, dayId);
        setModalVisible(false);
        const assignedNow = getAssignedDay(date);
        setNote(assignedNow?.notes ?? '');
        setLocalIsDone(Boolean(assignedNow?.done === 1 || assignedNow?.done === true));
      } finally {
        setAssigning(false);
      }
    };

    const markedDates = useMemo(() => {
    const map = {};
    Object.keys(selectedDays || {}).forEach((d) => {
      const entry = selectedDays[d];
      map[d] = {
        marked: true,
        dotColor: entry.done ? '#4CAF50' : '#2196f3',
      };
    });
    if (selectedDate) {
      map[selectedDate] = {
        ...(map[selectedDate] || {}),
        selected: true,
        selectedColor: isDone ? '#4CAF50' : '#2196f3',
      };
    }
    return map;
  }, [selectedDays, selectedDate, isDone]);

  return (
    <View style={styles.container}>
      <CustAppBar title="Training Calendar" />

      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          todayTextColor: '#e91e63',
          arrowColor: '#2196f3',
        }}
        style={styles.calendar}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!selectedDate ? (
          <Text style={styles.text}>Select a day from the calendar 📅</Text>
        ) : assigned ? (
          <>
            <Text style={styles.text}>A training day is assigned to this date ✅</Text>

            <Button
              mode="contained"
              onPress={openDay}
              icon="dumbbell"
              style={styles.button}
              disabled={marking || savingNote || deleting || assigning}
            >
              Open assigned training
            </Button>

            <Button
              mode="contained"
              onPress={handleMarkDayAsDone}
              icon="check-circle"
              loading={marking}
              disabled={marking || isDone}
              buttonColor={isDone ? '#4CAF50' : undefined} 
              style={styles.button}
            >
              {isDone ? 'Training marked as done ✅' : 'Mark training as done'}
            </Button>
                      

            <TextInput
              label="Add a note"
              value={note}
              onChangeText={setNote}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={3}
            />

            <Button
             mode="outlined"
             onPress={handleSaveNote}
             style={styles.button}
             icon="content-save"
             loading={savingNote}
             disabled={savingNote || marking || assigning}
            >
              Save note
            </Button>

            <Button 
            mode="text"
            onPress={handleDeleteCalendarLog}
            textColor="#e53935" 
            style={styles.deleteButton} 
            icon="trash-can"
            loading={deleting}
            disabled={deleting || assigning || marking}
            >
              Remove assigned training
            </Button>
          </>
        ) : (
          <>
            <Text style={styles.text}>No training assigned. Select a program day:</Text>

            <Button 
            mode="contained" 
            onPress={() => setModalVisible(true)} 
            style={styles.button} 
            icon="plus-circle"
            loading={assigning}
            disabled={assigning}
            >
              Select program day
            </Button>
          </>
        )}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.text}>Select a program day:</Text>

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
                        Select
                      </Button>
                    )}
                  />
                </Card>
              )}
            />

            <Button mode="text" onPress={() => setModalVisible(false)} icon="close">
              Close
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