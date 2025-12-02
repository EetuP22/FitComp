import React, { createContext, useState, useContext, useEffect } from 'react';
import { calendarRepo } from '../repositories/calendarRepo';

// Luo kalenterikontekstin
const CalendarContext = createContext();

//  Tarjoaa kalenterikontekstin lapsikomponenteille
export const CalendarProvider = ({ children }) => {
  const [selectedDays, setSelectedDays] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lataa kalenterimerkinnät komponentin mountatessa  
  useEffect(() => {
    loadCalendarEntries();
  }, []);

  // Lataa kalenterimerkinnät
  const loadCalendarEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await calendarRepo.getCalendarEntries();
      setSelectedDays(data);
    } catch (err) {
      setError(err.message);
      console.error('CalendarProvider.loadCalendarEntries error', err);
    } finally {
      setLoading(false);
    }
  };
// Määritä treenipäivä tietylle päivälle
  const assignDayToDate = async (dateString, programId, dayId) => {
    try {
      await calendarRepo.assignDayToDate(dateString, programId, dayId);
      await loadCalendarEntries();
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('assignDayToDate error', err);
    }
  };
// Poista kalenterimerkintä päivämäärältä
  const deleteCalendarEntry = async (date) => {
    try {
      await calendarRepo.deleteCalendarEntry(date);
      await loadCalendarEntries();
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('deleteCalendarEntry error', err);
    }
  };
// Poista kalenterimerkintä päivä-ID:n perusteella
  const deleteCalendarEntryByDayId = async (dayId) => {
    try {
      await calendarRepo.deleteCalendarEntryByDayId(dayId);
      await loadCalendarEntries();
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('deleteCalendarEntryByDayId error', err);
    }
  };
// Merkitse kalenterimerkintä tehdyksi
  const markCalendarEntryAsDone = async (date) => {
    try {
      await calendarRepo.markCalendarEntryAsDone(date);
      await loadCalendarEntries();
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('markCalendarEntryAsDone error', err);
    }
  };
// Päivitä kalenterimerkinnän muistiinpanot
  const updateCalendarNotes = async (date, notes) => {
    try {
      await calendarRepo.updateCalendarNotes(date, notes);
      await loadCalendarEntries();
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('updateCalendarNotes error', err);
    }
  };
// Hae määritetty treenipäivä tietylle päivämäärälle
  const getAssignedDay = (dateString) => selectedDays[dateString];

  // Tarjoa kontekstin arvot lapsikomponenteille
  return (
    <CalendarContext.Provider
      value={{
        selectedDays,
        loading,
        error,
        loadCalendarEntries,
        assignDayToDate,
        deleteCalendarEntry,
        deleteCalendarEntryByDayId,
        markCalendarEntryAsDone,
        updateCalendarNotes,
        getAssignedDay,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

// Mukauta kalenterikontekstin käyttöä
export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within CalendarProvider');
  }
  return context;
};