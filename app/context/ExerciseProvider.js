import React, { createContext, useContext, useState } from 'react';
import { exerciseRepo } from '../repositories/exerciseRepo';

// Luo konteksti harjoituksille
const ExerciseContext = createContext();

// Tarjoa harjoituskonteksti lapsikomponenteille
export const ExerciseProvider = ({ children }) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hae harjoituksia annetuilla suodattimilla
  const searchExercises = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await exerciseRepo.getExercises(filters);
      setExercises(data);
    } catch (err) {
      setError(err.message);
      console.error('❌ searchExercises error', err);
    } finally {
      setLoading(false);
    }
  };

  // Hae harjoituksia tietyn lihasryhmän perusteella
  const searchByMuscle = async (muscle) => {
    setLoading(true);
    setError(null);
    try {
      const data = await exerciseRepo.getExercises({muscle, page: 1, limit: 50});
      setExercises(data);
    } catch (err) {
      setError(err.message);
      console.error('searchByMuscle error', err);
    } finally {
      setLoading(false);
    }
  };
// Lisää mukautettu harjoitus tietokantaan
// Ei ole tällä hetkellä käytössä käyttöliittymässä!
  const addCustomExercise = async (id, name, muscle, difficulty) => {
    try {
      await exerciseRepo.addCustomExercise(id, name, muscle, difficulty);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('addCustomExercise error', err);
    }
  };

  // Tarjoa kontekstin arvot lapsikomponenteille
  return (
    <ExerciseContext.Provider
      value={{
        exercises,
        loading,
        error,
        searchExercises,
        searchByMuscle,
        addCustomExercise,
      }}
    >
      {children}
    </ExerciseContext.Provider>
  );
};

// Mukauta harjoituskontekstin käyttöä
export const useExercise = () => {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error('useExercise must be used within ExerciseProvider');
  }
  return context;
};


