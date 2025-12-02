import React, { createContext, useState, useContext, useEffect } from 'react';
import { programRepo } from '../repositories/programRepo';

// Luo konteksti treeniohjelmille
const ProgramContext = createContext();

// Tarjoaa treeniohjelmakontekstin lapsikomponenteille
export const ProgramProvider = ({ children }) => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lataa treeniohjelmat komponentin mountatessa
  useEffect(() => {
    loadPrograms();
  }, []);

  // Lataa treeniohjelmat
  const loadPrograms = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await programRepo.getPrograms();
      setPrograms(data);
    } catch (err) {
      setError(err.message);
      console.error('ProgramProvider.loadPrograms error', err);
    } finally {
      setLoading(false);
    }
  };

  // Lisää uusi treeniohjelma
  const addProgram = async (programName, programDesc = '') => {
    const id = Date.now().toString();
    const name = programName.trim();
    const desc = programDesc.trim();

    try {
      await programRepo.addProgram(id, name, desc);
      const newProgram = { id, name, desc, days: [] };
      setPrograms((prev) => [...prev, newProgram]);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('addProgram error', err);
    }
  };

  // Poista treeniohjelma
  const deleteProgram = async (id) => {
    try {
      await programRepo.deleteProgram(id);
      setPrograms((prev) => prev.filter((p) => p.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('deleteProgram error', err);
    }
  };

  // Lisää uusi päivä treeniohjelmaan
  const addDay = async (programId, dayName) => {
    const newId = Date.now().toString();
    const name = dayName.trim();

    try {
      await programRepo.addDay(newId, programId, name);
      setPrograms((prev) =>
        prev.map((p) =>
          p.id === programId
            ? { ...p, days: [...p.days, { id: newId, name, exercises: [] }] }
            : p
        )
      );
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('addDay error', err);
    }
  };

  // Poista päivä treeniohjelmasta
  const deleteDay = async (programId, dayId) => {
    try {
      await programRepo.deleteDay(dayId);
      setPrograms((prev) =>
        prev.map((p) =>
          p.id === programId
            ? { ...p, days: p.days.filter((d) => d.id !== dayId) }
            : p
        )
      );
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('deleteDay error', err);
    }
  };

  // Lisää harjoitus tiettyyn päivään
  const addExercise = async (programId, dayId, exerciseName) => {
    const newId = Date.now().toString();
    const name = exerciseName.trim();

    try {
      await programRepo.addExercise(newId, dayId, name);
      setPrograms((prev) =>
        prev.map((p) =>
          p.id === programId
            ? {
                ...p,
                days: p.days.map((d) =>
                  d.id === dayId
                    ? { ...d, exercises: [...d.exercises, { id: newId, name }] }
                    : d
                ),
              }
            : p
        )
      );
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('addExercise error', err);
    }
  };

  // Poista harjoitus päivästä
  const deleteExercise = async (programId, dayId, exerciseId) => {
    try {
      await programRepo.deleteExercise(exerciseId);
      setPrograms((prev) =>
        prev.map((p) =>
          p.id === programId
            ? {
                ...p,
                days: p.days.map((d) =>
                  d.id === dayId
                    ? { ...d, exercises: d.exercises.filter((e) => e.id !== exerciseId) }
                    : d
                ),
              }
            : p
        )
      );
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('deleteExercise error', err);
    }
  };

  // Hae treeniohjelma ID:llä
  const getProgramById = (programId) => programs.find((p) => p.id === programId);

  // Hae päivä ID:llä tietystä treeniohjelmasta
  const getDayById = (programId, dayId) =>
    getProgramById(programId)?.days.find((d) => d.id === dayId);

  // Tarjoa kontekstin arvot lapsikomponenteille
  return (
    <ProgramContext.Provider
      value={{
        programs,
        loading,
        error,
        loadPrograms,
        addProgram,
        deleteProgram,
        addDay,
        deleteDay,
        addExercise,
        deleteExercise,
        getProgramById,
        getDayById,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};

// Mukauta treeniohjelmakontekstin käyttöä
export const useProgram = () => {
  const context = useContext(ProgramContext);
  if (!context) {
    throw new Error('useProgram must be used within ProgramProvider');
  }
  return context;
};