import {
  addWorkoutLog as dbAddWorkoutLog,
  getWorkoutLogsByExercise,
  getWorkoutLogsByDate,
  getAllWorkoutLogs,
  deleteWorkoutLog as dbDeleteWorkoutLog,
} from '../db/database';

export const workoutLogRepo = {
  async addWorkoutLog(id, exerciseId, exerciseName, date, sets, reps, weight, notes) {
    try {
      await dbAddWorkoutLog(id, exerciseId, exerciseName, date, sets, reps, weight, notes);
    } catch (err) {
      console.error('workoutLogRepo.addWorkoutLog error', err);
      throw err;
    }
  },

  async getWorkoutLogsByExercise(exerciseName) {
    try {
      const logs = await getWorkoutLogsByExercise(exerciseName);
      return logs;
    } catch (err) {
      console.error('workoutLogRepo.getWorkoutLogsByExercise error', err);
      return [];
    }
  },

  async getWorkoutLogsByDate(date) {
    try {
      const logs = await getWorkoutLogsByDate(date);
      return logs;
    } catch (err) {
      console.error('workoutLogRepo.getWorkoutLogsByDate error', err);
      return [];
    }
  },

  async getAllWorkoutLogs(limit = 100) {
    try {
      const logs = await getAllWorkoutLogs(limit);
      return logs;
    } catch (err) {
      console.error('workoutLogRepo.getAllWorkoutLogs error', err);
      return [];
    }
  },

  async deleteWorkoutLog(id) {
    try {
      await dbDeleteWorkoutLog(id);
    } catch (err) {
      console.error('workoutLogRepo.deleteWorkoutLog error', err);
      throw err;
    }
  },
};
