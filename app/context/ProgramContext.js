import React, { createContext, useState, useContext } from 'react';

const ProgramContext = createContext();

export const ProgramProvider = ({ children }) => {
    const [programs, setPrograms] = useState([]);
    const [selectedDays, setSelectedDays] = useState([]);

    const addProgram = (programName, programDesc = '') => {

        const newProgram = {
            id: Date.now().toString(),
            name: programName.trim(),
            desc: programDesc.trim(),
            days: [],
        };
        setPrograms((prev) => [...prev, newProgram]);
    };

    const deleteProgram = (id) => {
        setPrograms((prev) => prev.filter((p) => p.id !== id));
    };

    const addDay = (programId, dayName) => {
        setPrograms((prev) =>
            prev.map((p) =>
                p.id === programId
                    ? {
                        ...p,
                        days: [
                            ...p.days,
                            { id: Date.now().toString(), name: dayName.trim(), exercises: [] },
                        ],
                    }
                    : p
            )
        );
    };

     const deleteDay = (programId, dayId) => {
        setPrograms((prev) =>
            prev.map((p) =>
                p.id === programId
                    ? { ...p, days: p.days.filter((d) => d.id !== dayId) }
                    : p
            )
        );
    };

    const addExercise = (programId, dayId, exerciseName) => {
        setPrograms((prev) =>
            prev.map((p) =>
                p.id === programId
                    ? {
                        ...p,
                        days: p.days.map((d) =>
                            d.id === dayId
                                ? {
                                    ...d,
                                    exercises: [
                                        ...d.exercises,
                                        { id: Date.now().toString(), name: exerciseName.trim() },
                                    ],
                                }
                                : d
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

const getProgramById = (programId) => {
  return programs.find((p) => p.id === programId);
};

const getDayById = (programId, dayId) => {
  const program = getProgramById(programId);
  return program?.days.find((d) => d.id === dayId);
};

const assignDayToDate = (dateString, programId, dayId) => {
    setSelectedDays((prev) => ({
        ...prev,
        [dateString]: { programId, dayId },
    }));

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