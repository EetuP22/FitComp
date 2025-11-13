import * as SQLite from 'expo-sqlite';

let db = null;

export const initDatabase = async () => {
    try {
        db = await SQLite.openDatabaseAsync('fitcomp.db');

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS programs (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT
      );
    `);

    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS days (
        id TEXT PRIMARY KEY,
        programId TEXT NOT NULL,
        name TEXT NOT NULL,
        FOREIGN KEY (programId) REFERENCES programs(id)
    );
    `);

    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS exercises (
        id TEXT PRIMARY KEY,
        dayId TEXT NOT NULL,
        name TEXT NOT NULL,
        FOREIGN KEY (dayId) REFERENCES days(id)
    );
`);

    await createCalendarTable();


    console.log("✅ FitComp SQLite tietokanta alustettu");
  } catch (error) {
    console.log("❌ Virhe tietokannan alustuksessa:", error);
  }
};

export const getPrograms = async () => {
    if (!db) return [];
    try {
        const result = await db.getAllAsync('SELECT * FROM programs;');
        return result;
    } catch (error) {
        console.log("❌ Virhe haettaessa ohjelmia:", error);
        return [];
    }
};


export const addProgram = async (id, name, description) => {
    if (!db) return;
    try {
        await db.runAsync(
        'INSERT INTO programs (id, name, description) VALUES (?, ?, ?);',
        [id, name, description]
        );
    } catch (error) {
        console.log("❌ Virhe lisättäessä ohjelmaa:", error);
    }
};


export const deleteProgram = async (id) => {
    if (!db) return;
    try {
        await db.runAsync('DELETE FROM programs WHERE id = ?;', [id]);
    } catch (error) {
        console.log("❌ Virhe poistettaessa ohjelmaa:", error);
    }
};

export const getDaysByProgram = async (programId) => {
    if (!db) return [];
    try {
        return await db.getAllAsync('SELECT * FROM days WHERE programId = ?;', [programId]);
    } catch (error) {
        console.log("❌ Virhe haettaessa päiviä ohjelmalle:", error);
        return [];
    }
};

export const addDayToDb = async (id, programId, name) => {
    if (!db) return;
    try {
        await db.runAsync(
        'INSERT INTO days (id, programId, name) VALUES (?, ?, ?);',
        [id, programId, name]
        );
    } catch (error) {
        console.log("❌ Virhe lisättäessä päivää:", error);
    }
};


export const deleteDayFromDb = async (id) => {
    if (!db) return;
    try {
        await db.runAsync('DELETE FROM days WHERE id = ?;', [id]);
    } catch (error) {
        console.log("❌ Virhe poistettaessa päivää:", error);
    }
};

export const getExercisesByDay = async (dayId) => {
    if (!db) return [];
    try {
        return await db.getAllAsync('SELECT * FROM exercises WHERE dayId = ?;', [dayId]);
    } catch (error) {
        console.log("❌ Virhe haettaessa harjoituksia päivälle:", error);
        return [];
    }
};


export const addExerciseToDb = async (id, dayId, name) => {
    if (!db) return;
    try {
        await db.runAsync(
        'INSERT INTO exercises (id, dayId, name) VALUES (?, ?, ?);',
        [id, dayId, name]
        );
    } catch (error) {
        console.log("❌ Virhe lisättäessä harjoitusta:", error);
    }
};


export const deleteExerciseFromDb = async (id) => {
    if (!db) return;
    try {
        await db.runAsync('DELETE FROM exercises WHERE id = ?;', [id]);
    } catch (error) {
        console.log("❌ Virhe poistettaessa harjoitusta:", error);
    }
};

export const createCalendarTable = async () => {
    if (!db) return;
    try  {
        await db.execAsync(`
        CREATE TABLE IF NOT EXISTS calendar_entries (
            date TEXT PRIMARY KEY,
            programId TEXT,
            dayId TEXT,
            FOREIGN KEY (programId) REFERENCES programs(id),
            FOREIGN KEY (dayId) REFERENCES days(id)
        );
        `);
    } catch (error) {
        console.log("❌ Virhe luotaessa kalenteritaulua:", error);
    }
};

export const dbAssignDayToDate = async (date, programId, dayId) => {
    if (!db) return;
    try {
        await db.runAsync(
        `INSERT OR REPLACE INTO calendar_entries (date, programId, dayId) VALUES (?, ?, ?);`,
        [date, programId, dayId]
        );
    } catch (error) {
        console.log("❌ Virhe kalenterimerkintää lisättäessä:", error);
    }
};

export const getCalendarEntries = async () => {
    if (!db) return [];
    try {
        return await db.getAllAsync('SELECT * FROM calendar_entries;');
    } catch (error) {
        console.log("❌ Virhe haettaessa kalenterimerkintöjä:", error);
        return [];
    }
};
