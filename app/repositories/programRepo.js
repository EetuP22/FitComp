// Määritellään ohjelmarepositorio ohjelmien, päivien ja harjoitusten käsittelyyn
import {
  getPrograms as dbGetPrograms,
  addProgram as dbAddProgram,
  deleteProgram as dbDeleteProgram,
  getDaysByProgram,
  addDayToDb,
  deleteDayFromDb,
  getExercisesByDay,
  addExerciseToDb,
  deleteExerciseFromDb,
} from '../db/database';

// Määritellään ohjelmarepositorio
export const programRepo = {
  async getPrograms() {
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
      return loadedPrograms;
    } catch (err) {
      console.error('programRepo.getPrograms error', err);
      return [];
    }
  },

  // Lisää uusi ohjelma tietokantaan
  async addProgram(id, name, description) {
    try {
      await dbAddProgram(id, name, description);
    } catch (err) {
      console.error('programRepo.addProgram error', err);
      throw err;
    }
  },

  // Poista ohjelma tietokannasta
  async deleteProgram(id) {
    try {
      await dbDeleteProgram(id);
    } catch (err) {
      console.error('programRepo.deleteProgram error', err);
      throw err;
    }
  },

  // Lisää päivä ohjelmaan
  async addDay(id, programId, name) {
    try {
      await addDayToDb(id, programId, name);
    } catch (err) {
      console.error('programRepo.addDay error', err);
      throw err;
    }
  },

  // Poista päivä ohjelmasta
  async deleteDay(id) {
    try {
      await deleteDayFromDb(id);
    } catch (err) {
      console.error('programRepo.deleteDay error', err);
      throw err;
    }
  },

  // Lisää harjoitus päivään
  async addExercise(id, dayId, name) {
    try {
      await addExerciseToDb(id, dayId, name);
    } catch (err) {
      console.error('programRepo.addExercise error', err);
      throw err;
    }
  },

  // Poista harjoitus päivästä
  async deleteExercise(id) {
    try {
      await deleteExerciseFromDb(id);
    } catch (err) {
      console.error('programRepo.deleteExercise error', err);
      throw err;
    }
  },
};