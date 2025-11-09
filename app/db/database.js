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