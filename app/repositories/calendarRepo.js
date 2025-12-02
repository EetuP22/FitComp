// importataan tietokantatoiminnot kalenterimerkintöjen hallintaan
import {
  dbAssignDayToDate,
  getCalendarEntries,
  dbDeleteCalendarEntry,
  dbDeleteCalendarEntryByDayId,
  dbMarkCalendarEntryAsDone,
  dbUpdateCalendarNotes,
} from '../db/database';

// Määritellään kalenterirepositorio kalenterimerkintöjen käsittelyyn
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

  // Määritä treenipäivä tietylle päivämäärälle
  async assignDayToDate(date, programId, dayId) {
    try {
      await dbAssignDayToDate(date, programId, dayId);
    } catch (err) {
      console.error('calendarRepo.assignDayToDate error', err);
      throw err;
    }
  },

  // Poista kalenterimerkintä tietystä päivämäärästä
  async deleteCalendarEntry(date) {
    try {
      await dbDeleteCalendarEntry(date);
    } catch (err) {
      console.error('calendarRepo.deleteCalendarEntry error', err);
      throw err;
    }
  },

  // Poista kalenterimerkintä päivä-ID:n perusteella(Jos kyseinen päivä poistetaan ohjelmasta)
  async deleteCalendarEntryByDayId(dayId) {
    try {
      await dbDeleteCalendarEntryByDayId(dayId);
    } catch (err) {
      console.error('calendarRepo.deleteCalendarEntryByDayId error', err);
      throw err;
    }
  },

  // Merkitse kalenterimerkintä tehdyksi
  async markCalendarEntryAsDone(date) {
    try {
      await dbMarkCalendarEntryAsDone(date);
    } catch (err) {
      console.error('calendarRepo.markCalendarEntryAsDone error', err);
      throw err;
    }
  },

  // Päivitä kalenterimerkinnän muistiinpanot
  async updateCalendarNotes(date, notes) {
    try {
      await dbUpdateCalendarNotes(date, notes);
    } catch (err) {
      console.error('calendarRepo.updateCalendarNotes error', err);
      throw err;
    }
  },
};