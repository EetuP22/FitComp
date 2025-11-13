import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  initDatabase,
  getPrograms as dbGetPrograms,
  addProgram as dbAddProgram,
  deleteProgram as dbDeleteProgram,
  getDaysByProgram,
  addDayToDb,
  deleteDayFromDb,
  getExercisesByDay,
  addExerciseToDb,
  deleteExerciseFromDb,
  dbAssignDayToDate,
  getCalendarEntries,
} from '../db/database';

const ProgramContext = createContext();

export const ProgramProvider = ({ children }) => {
  const [programs, setPrograms] = useState([]);
  const [selectedDays, setSelectedDays] = useState({});

  useEffect(() => {
    const initAndLoad = async () => {
      await initDatabase(); 
      await loadProgramsFromDb();
      await loadCalendarFromDb();
    };
    initAndLoad();
  }, []);

  const loadCalendarFromDb = async () => {
    try {
        const entries = await getCalendarEntries();
        const mapped = {};
        entries.forEach((e) => {
            mapped[e.date] = { programId: e.programId, dayId: e.dayId };
        });
        setSelectedDays(mapped);
    } catch (err) {
        console.error('loadCalendarFromDb error', err);
    }
  };

   const loadProgramsFromDb = async () => {
    try {
      const rows = await dbGetPrograms();

      const loadedPrograms = [];
      for (const p of rows) {
        const days = await getDaysByProgram(p.id); 
        const daysWithExercises = [];
        for (const d of days) {
            const exercises = await getExercisesByDay(d.id);
            daysWithExercises.push({ id: d.id, name: d.name, exercises });
        }
        loadedPrograms.push({
          id: p.id,
          name: p.name,
          desc: p.description || '',
          days: daysWithExercises,
        });
      }
      setPrograms(loadedPrograms);
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

  const addDay = async (programId, dayName) => {
    const newId = Date.now().toString();
    const name = dayName.trim();

    await addDayToDb(newId, programId, name);

     setPrograms((prev) =>
      prev.map((p) =>
        p.id === programId
          ? { ...p, days: [...p.days, { id: newId, name, exercises: [] }] }
          : p
      )
    );
  };

  const deleteDay = async (programId, dayId) => {
    await deleteDayFromDb(dayId);

    setPrograms((prev) =>
         prev.map((p) =>
             (p.id === programId
                 ? { ...p, days: p.days.filter((d) => d.id !== dayId) }
                  : p
                )
            )
        );
  };


  const addExercise = async (programId, dayId, exerciseName) => {
    const newId = Date.now().toString();
    const name = exerciseName.trim();

    await addExerciseToDb(newId, dayId, name);

    setPrograms((prev) =>
      prev.map((p) =>
        p.id === programId
          ? {
              ...p,
              days: p.days.map((d) =>
                d.id === dayId ? { ...d, exercises: [...d.exercises, { id: newId, name }] } : d
              ),
            }
          : p
      )
    );
  };

  const deleteExercise = async (programId, dayId, exerciseId) => {
    await deleteExerciseFromDb(exerciseId);
   setPrograms((prev) =>
      prev.map((p) =>
        p.id === programId
          ? {
              ...p,
              days: p.days.map((d) =>
                d.id === dayId
                  ? {
                      ...d,
                      exercises: d.exercises.filter((e) => e.id !== exerciseId),
                    }
                  : d
              ),
            }
          : p
      )
    );
  };

  const getProgramById = (programId) => programs.find((p) => p.id === programId);

  const getDayById = (programId, dayId) => getProgramById(programId)?.days.find((d) => d.id === dayId);

 const assignDayToDate = async (dateString, programId, dayId) => {
    try {
      await dbAssignDayToDate(dateString, programId, dayId);
      setSelectedDays((prev) => ({
        ...prev,
        [dateString]: { programId, dayId },
      }));
    } catch (err) {
      console.error('assignDayToDate error', err);
    }
  };

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
