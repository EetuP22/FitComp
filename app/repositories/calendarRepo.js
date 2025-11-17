import {
  dbAssignDayToDate,
  getCalendarEntries,
  dbDeleteCalendarEntry,
  dbDeleteCalendarEntryByDayId,
  dbMarkCalendarEntryAsDone,
  dbUpdateCalendarNotes,
} from '../db/database';

export const calendarRepo = {
  async getCalendarEntries() {
    try {
      const entries = await getCalendarEntries();
      const mapped = {};
      entries.forEach((e) => {
        mapped[e.date] = {
          programId: e.programId,
          dayId: e.dayId,
          done: e.done === 1 || e.done === true,
          notes: e.notes,
        };
      });
      return mapped;
    } catch (err) {
      console.error('calendarRepo.getCalendarEntries error', err);
      return {};
    }
  },

  async assignDayToDate(date, programId, dayId) {
    try {
      await dbAssignDayToDate(date, programId, dayId);
    } catch (err) {
      console.error('calendarRepo.assignDayToDate error', err);
      throw err;
    }
  },

  async deleteCalendarEntry(date) {
    try {
      await dbDeleteCalendarEntry(date);
    } catch (err) {
      console.error('calendarRepo.deleteCalendarEntry error', err);
      throw err;
    }
  },

  async deleteCalendarEntryByDayId(dayId) {
    try {
      await dbDeleteCalendarEntryByDayId(dayId);
    } catch (err) {
      console.error('calendarRepo.deleteCalendarEntryByDayId error', err);
      throw err;
    }
  },

  async markCalendarEntryAsDone(date) {
    try {
      await dbMarkCalendarEntryAsDone(date);
    } catch (err) {
      console.error('calendarRepo.markCalendarEntryAsDone error', err);
      throw err;
    }
  },

  async updateCalendarNotes(date, notes) {
    try {
      await dbUpdateCalendarNotes(date, notes);
    } catch (err) {
      console.error('calendarRepo.updateCalendarNotes error', err);
      throw err;
    }
  },
};