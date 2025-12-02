import React, { createContext, useContext, useState, useEffect } from 'react';
import { workoutLogRepo } from '../repositories/workoutLogRepo';

// Luo treenilokikonteksti
const WorkoutLogContext = createContext();

// Tarjoa treenilokikonteksti lapsikomponenteille
export const WorkoutLogProvider = ({ children }) => {
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lataa treenilokit komponentin mountatessa
  useEffect(() => {
    loadWorkoutLogs();
  }, []);

  // Lataa treenilokit
  const loadWorkoutLogs = async (limit = 100) => {
    setLoading(true);
    setError(null);
    try {
      const logs = await workoutLogRepo.getAllWorkoutLogs(limit);
      setWorkoutLogs(logs);
    } catch (err) {
      setError(err.message);
      console.error('WorkoutLogProvider.loadWorkoutLogs error', err);
    } finally {
      setLoading(false);
    }
  };

  // Lisää uusi treeniloki
  const addWorkoutLog = async (exerciseId, exerciseName, date, sets, reps, weight, notes = '') => {
    const id = Date.now().toString();
    try {
      await workoutLogRepo.addWorkoutLog(id, exerciseId, exerciseName, date, sets, reps, weight, notes);
      await loadWorkoutLogs();
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('addWorkoutLog error', err);
      throw err;
    }
  };

  // Hae treenilokit harjoituksen nimen perusteella
  const getLogsByExercise = async (exerciseName) => {
    try {
      const logs = await workoutLogRepo.getWorkoutLogsByExercise(exerciseName);
      return logs;
    } catch (err) {
      console.error('getLogsByExercise error', err);
      return [];
    }
  };

  // Hae treenilokit tietyn päivämäärän perusteella
  // Ei käytössä tällä hetkellä käyttöliittymässä!
  const getLogsByDate = async (date) => {
    try {
      const logs = await workoutLogRepo.getWorkoutLogsByDate(date);
      return logs;
    } catch (err) {
      console.error('getLogsByDate error', err);
      return [];
    }
  };

  // Poista treeniloki
  const deleteWorkoutLog = async (id) => {
    try {
      await workoutLogRepo.deleteWorkoutLog(id);
      await loadWorkoutLogs();
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('deleteWorkoutLog error', err);
    }
  };

  // Tarjoa kontekstin arvot lapsikomponenteille
  return (
    <WorkoutLogContext.Provider
      value={{
        workoutLogs,
        loading,
        error,
        loadWorkoutLogs,
        addWorkoutLog,
        getLogsByExercise,
        getLogsByDate,
        deleteWorkoutLog,
      }}
    >
      {children}
    </WorkoutLogContext.Provider>
  );
};

// Mukauta treenilokikontekstin käyttöä
export const useWorkoutLog = () => {
  const context = useContext(WorkoutLogContext);
  if (!context) {
    throw new Error('useWorkoutLog must be used within WorkoutLogProvider');
  }
  return context;
};
