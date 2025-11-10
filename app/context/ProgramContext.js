import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  initDatabase,
  getPrograms as dbGetPrograms,
  addProgram as dbAddProgram,
  deleteProgram as dbDeleteProgram,
} from '../db/database';

const ProgramContext = createContext();

export const ProgramProvider = ({ children }) => {
  const [programs, setPrograms] = useState([]);
  const [selectedDays, setSelectedDays] = useState({});

  useEffect(() => {
    const initAndLoad = async () => {
      await initDatabase(); 
      await loadProgramsFromDb();
    };
    initAndLoad();
  }, []);

  const loadProgramsFromDb = async () => {
    try {
      const rows = await dbGetPrograms();
      const mapped = rows.map((p) => ({
        id: p.id,
        name: p.name,
        desc: p.description || '',
        days: [], 
      }));
      setPrograms(mapped);
    } catch (err) {
      console.error('loadProgramsFromDb error', err);
    }
  };

  const addProgram = async (programName, programDesc = '') => {
    const id = Date.now().toString();
    const name = programName.trim();
    const desc = programDesc.trim();

    try {
      await dbAddProgram(id, name, desc);
      const newProgram = { id, name, desc, days: [] };
      setPrograms((prev) => [...prev, newProgram]);
    } catch (err) {
      console.error('addProgram error', err);
    }
  };

  const deleteProgram = async (id) => {
    try {
      await dbDeleteProgram(id);
      setPrograms((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('deleteProgram error', err);
    }
  };

  const addDay = (programId, dayName) => {
    setPrograms((prev) =>
      prev.map((p) =>
        p.id === programId
          ? { ...p, days: [...p.days, { id: Date.now().toString(), name: dayName.trim(), exercises: [] }] }
          : p
      )
    );
  };

  const deleteDay = (programId, dayId) =>
    setPrograms((prev) => prev.map((p) => (p.id === programId ? { ...p, days: p.days.filter((d) => d.id !== dayId) } : p)));

  const addExercise = (programId, dayId, exerciseName) => {
    setPrograms((prev) =>
      prev.map((p) =>
        p.id === programId
          ? {
              ...p,
              days: p.days.map((d) =>
                d.id === dayId ? { ...d, exercises: [...d.exercises, { id: Date.now().toString(), name: exerciseName.trim() }] } : d
              ),
            }
          : p
      )
    );
  };

  const deleteExercise = (programId, dayId, exerciseId) => {
    setPrograms((prev) =>
      prev.map((p) =>
        p.id === programId
          ? { ...p, days: p.days.map((d) => (d.id === dayId ? { ...d, exercises: d.exercises.filter((e) => e.id !== exerciseId) } : d)) }
          : p
      )
    );
  };

  const getProgramById = (programId) => programs.find((p) => p.id === programId);

  const getDayById = (programId, dayId) => getProgramById(programId)?.days.find((d) => d.id === dayId);

  const assignDayToDate = (dateString, programId, dayId) =>
    setSelectedDays((prev) => ({ ...prev, [dateString]: { programId, dayId } }));

  const getAssignedDay = (dateString) => selectedDays[dateString];

  return (
    <ProgramContext.Provider
      value={{
        programs,
        addProgram,
        deleteProgram,
        addDay,
        deleteDay,
        addExercise,
        deleteExercise,
        getProgramById,
        getDayById,
        selectedDays,
        assignDayToDate,
        getAssignedDay,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};

export const useProgram = () => useContext(ProgramContext);
