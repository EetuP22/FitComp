import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Modal } from 'react-native';
import CustAppBar from '../components/CustAppBar';
import { Calendar } from 'react-native-calendars';
import { Button, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useProgram } from '../context/ProgramContext';

export default function CalendarScreen() {
    const [selectedDate, setSelectedDate] = React.useState('');
    const [ modalVisible, setModalVisible ] = useState(false);


    const navigation = useNavigation();
    const { programs, getAssignedDay, assignDayToDate } = useProgram();

    const assigned = selectedDate ? getAssignedDay(selectedDate) : null;

    const openDay = () => {
      if (!assigned) return;
      navigation.navigate('DayDetailModal', {
        programId: assigned.programId,
        dayId: assigned.dayId,
      });
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
      />

      <View style={styles.content}>
        {!selectedDate ? (
          <Text style={styles.text}>Valitse päivä kalenterista 📅</Text>
        ) : assigned ? (
          <>
            <Text style={styles.text}>Tälle päivälle on liitetty treenipäivä ✅</Text>
            <Button mode="contained" onPress={openDay}>
              Avaa liitetty treeni
            </Button>
          </>
        ) : (
          <>
            <Text style={styles.text}>Ei liitettyä treeniä. Valitse ohjelmapäivä:</Text>

            <Button mode="contained" onPress={() => setModalVisible(true)}>
              Valitse ohjelmapäivä
            </Button>
          </>
        )}
      </View>

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
                        onPress={() => {
                          assignDayToDate(selectedDate, item.programId, item.id);
                          setModalVisible(false);
                        }}
                      >
                        Valitse
                      </Button>
                    )}
                  />
                </Card>
              )}
            />

            <Button mode="text" onPress={() => setModalVisible(false)}>
              Sulje
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 16 },
  text: { fontSize: 18, color: '#333', marginBottom: 12 },
  input: { marginBottom: 10 },
  button: { marginBottom: 16 },
  card: { marginVertical: 6 },
  modal: {flex: 1, justifyContent: 'center', backgroundColor: '#00000055'},
  modalContent: {backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 8 },
});