import * as SQLite from 'expo-sqlite';

let db = null;

export const initDatabase = async () => {
    try {
        db = await SQLite.openDatabaseAsync('fitcomp.db');
        await db.execAsync(`PRAGMA foreign_keys = ON;`);
    await db.execAsync(`PRAGMA journal_mode = WAL;`);
  


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

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS favorite_gyms (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          address TEXT,
          distance REAL,
          facilities TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await db.execAsync(`
      CREATE TABLE IF NOT EXISTS exercise_library (
        id TEXT PRIMARY KEY,
        wger_id INTEGER,
        name TEXT NOT NULL,
        description TEXT,
        muscles TEXT,
        equipment TEXT,
        images TEXT,
        videos TEXT,
        source TEXT,
        last_fetched INTEGER
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS favorite_exercises (
        id TEXT PRIMARY KEY,
        library_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS program_exercises (
        id TEXT PRIMARY KEY,
        programId TEXT,
        dayId TEXT,
        libraryId TEXT,
        customName TEXT,
        meta TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS custom_exercises (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      muscles TEXT,
      difficulty TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS workout_logs (
        id TEXT PRIMARY KEY,
        exercise_id TEXT,
        exercise_name TEXT NOT NULL,
        date TEXT NOT NULL,
        sets INTEGER,
        reps INTEGER,
        weight REAL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);


    await createCalendarTable();


    console.log("✅ FitComp SQLite tietokanta alustettu");
  } catch (error) {
    console.log("❌ Virhe tietokannan alustuksessa:", error);
  }
};

export const getDb = () => db;


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
            done INTEGER DEFAULT 0,
            notes TEXT,
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
            `INSERT OR REPLACE INTO calendar_entries (date, programId, dayId, done, notes) VALUES (?, ?, ?, COALESCE((SELECT done FROM calendar_entries WHERE date = ?), 0), COALESCE((SELECT notes FROM calendar_entries WHERE date = ?), ''));`,
            [date, programId, dayId, date, date]
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

export const dbDeleteCalendarEntry = async (date) => {
    if (!db) return;
    try {
        await db.runAsync('DELETE FROM calendar_entries WHERE date = ?;', [date]);
    } catch (error) {
        console.log("❌ Virhe poistettaessa kalenterimerkintää:", error);
    }
};


export const dbDeleteCalendarEntryByDayId = async (dayId) => {
    if (!db) return;
    try {
        await db.runAsync('DELETE FROM calendar_entries WHERE dayId = ?;', [dayId]);
    } catch (error) {
        console.log("❌ Virhe poistettaessa kalenterimerkintää:", error);
    }
};

export const dbMarkCalendarEntryAsDone = async (date) => {
    if (!db) return;
    try {
        await db.runAsync('UPDATE calendar_entries SET done = 1 WHERE date = ?;', [date]);
        console.log("✅ Kalenterimerkintä merkitty tehdyksi päivälle:", date);
    } catch (error) {
        console.log("❌ Virhe merkittäessä kalenteripäivää tehdyksi:", error);
    }
};

export const dbUpdateCalendarNotes = async (date, notes) => {
    if (!db) return;
    try {
        await db.runAsync('UPDATE calendar_entries SET notes = ? WHERE date = ?;', [notes, date]);
    } catch (error) {
        console.log("❌ Virhe päivitettäessä muistiinpanoja:", error);
    }

};

export const addWorkoutLog = async (id, exerciseId, exerciseName, date, sets, reps, weight, notes) => {
    if (!db) return;
    try {
        await db.runAsync(
            `INSERT INTO workout_logs (id, exercise_id, exercise_name, date, sets, reps, weight, notes) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
            [id, exerciseId, exerciseName, date, sets || null, reps || null, weight || null, notes || '']
        );
        console.log("✅ Workout log added:", exerciseName, date);
    } catch (error) {
        console.error("❌ Error adding workout log:", error);
        throw error;
    }
};

export const getWorkoutLogsByExercise = async (exerciseName) => {
    if (!db) return [];
    try {
        const logs = await db.getAllAsync(
            'SELECT * FROM workout_logs WHERE exercise_name = ? ORDER BY date DESC;',
            [exerciseName]
        );
        return logs || [];
    } catch (error) {
        console.error("❌ Error fetching workout logs by exercise:", error);
        return [];
    }
};

export const getWorkoutLogsByDate = async (date) => {
    if (!db) return [];
    try {
        const logs = await db.getAllAsync(
            'SELECT * FROM workout_logs WHERE date = ? ORDER BY created_at DESC;',
            [date]
        );
        return logs || [];
    } catch (error) {
        console.error("❌ Error fetching workout logs by date:", error);
        return [];
    }
};

export const getAllWorkoutLogs = async (limit = 100) => {
    if (!db) return [];
    try {
        const logs = await db.getAllAsync(
            'SELECT * FROM workout_logs ORDER BY date DESC, created_at DESC LIMIT ?;',
            [limit]
        );
        return logs || [];
    } catch (error) {
        console.error("❌ Error fetching all workout logs:", error);
        return [];
    }
};

export const deleteWorkoutLog = async (id) => {
    if (!db) return;
    try {
        await db.runAsync('DELETE FROM workout_logs WHERE id = ?;', [id]);
        console.log("✅ Workout log deleted:", id);
    } catch (error) {
        console.error("❌ Error deleting workout log:", error);
        throw error;
    }
};


