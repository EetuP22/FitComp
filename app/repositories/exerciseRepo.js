import { getDb } from '../db/database';
import { exerciseService } from '../services/exerciseService';

const mapRowToExercise = (row) => ({
  id: row.id,
  wger_id: row.wger_id,
  name: row.name,
  description: row.description,
  muscles: row.muscles ? JSON.parse(row.muscles) : [],
  equipment: row.equipment ? JSON.parse(row.equipment) : [],
  images: row.images ? JSON.parse(row.images) : [],
  videos: row.videos ? JSON.parse(row.videos) : [],
  source: row.source,
  last_fetched: row.last_fetched,
});

export const exerciseRepo = {
  async getExercises({ search = '', muscle = null, page = 1, limit = 20 } = {}) {
    try {
      const res = await exerciseService.fetchExercises({ search, muscle, page, limit });
      const db = getDb();
      if (db && typeof db.runAsync === 'function') {
        for (const item of res.results || []) {
          try {
            const id = `wger-${item.wger_id}`;
            const nameSafe = (item.name || `Exercise ${item.wger_id}`).trim() || `Exercise ${item.wger_id}`;
            await db.runAsync(
              `INSERT OR REPLACE INTO exercise_library (id, wger_id, name, description, muscles, equipment, images, videos, source, last_fetched)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                id,
                item.wger_id,
                nameSafe,
                item.description || '',
                JSON.stringify(item.muscles || []),
                JSON.stringify(item.equipment || []),
                JSON.stringify([]),
                JSON.stringify([]),
                'wger',
                Date.now(),
              ]
            );
          } catch (e) {
            console.warn('exerciseRepo: failed to upsert item', item?.wger_id, e);
          }
        }
      }
      return (res.results || []).map((r) => ({
        id: `wger-${r.wger_id}`,
        ...r,
      }));
    } catch (err) {
      console.error('exerciseRepo.getExercises error', err);
      throw err;
    }
  },

  async searchExercisesByMuscle(muscle, opts = {}) {
    return this.getExercises({ ...opts, muscle });
  },

  async getExerciseById(localId) {
    try {
      const db = getDb();

      if (db && typeof db.getFirstAsync === 'function') {
        const row = await db.getFirstAsync('SELECT * FROM exercise_library WHERE id = ?;', [localId]);
        if (row) return mapRowToExercise(row);
      }

      if (typeof localId === 'string' && localId.startsWith('wger-')) {
        const wgerId = parseInt(localId.replace('wger-', ''), 10);
        if (Number.isNaN(wgerId)) return null;

        const detail = await exerciseService.fetchExerciseDetail(wgerId);
        if (!detail) return null;

        const saveId = `wger-${detail.wger_id ?? detail.id ?? wgerId}`;
        const realWgerId = detail.wger_id ?? detail.id ?? wgerId;
        const nameSafe = (detail.name || `Exercise ${realWgerId}`).trim() || `Exercise ${realWgerId}`;

        if (db && typeof db.runAsync === 'function') {
          try {
            await db.runAsync(
              `INSERT OR REPLACE INTO exercise_library (id, wger_id, name, description, muscles, equipment, images, videos, source, last_fetched)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                saveId,
                realWgerId,
                nameSafe,
                detail.description || '',
                JSON.stringify(detail.muscles || []),
                JSON.stringify(detail.equipment || []),
                JSON.stringify(detail.images || []),
                JSON.stringify([]),
                'wger',
                Date.now(),
              ]
            );
          } catch (e) {
            console.warn('exerciseRepo.getExerciseById: failed to persist detail', e);
          }
        }

        return {
          id: saveId,
          wger_id: realWgerId,
          name: nameSafe,
          description: detail.description,
          muscles: detail.muscles || [],
          equipment: detail.equipment || [],
          images: detail.images || [],
          videos: [],
        };
      }

      return null;
    } catch (err) {
      console.error('exerciseRepo.getExerciseById error', err);
      throw err;
    }
  },

  async saveLibraryItem(item) {
    try {
      const db = getDb();
      const id = item.id || (item.wger_id ? `wger-${item.wger_id}` : Date.now().toString());
      const nameSafe = (item.name || `Exercise ${item.wger_id || id}`).trim() || String(id);
      if (db && typeof db.runAsync === 'function') {
        await db.runAsync(
          `INSERT OR REPLACE INTO exercise_library (id, wger_id, name, description, muscles, equipment, images, videos, source, last_fetched)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            item.wger_id || null,
            nameSafe,
            item.description || '',
            JSON.stringify(item.muscles || []),
            JSON.stringify(item.equipment || []),
            JSON.stringify(item.images || []),
            JSON.stringify(item.videos || []),
            item.source || 'local',
            Date.now(),
          ]
        );
        return id;
      }
      return id;
    } catch (err) {
      console.error('exerciseRepo.saveLibraryItem error', err);
      throw err;
    }
  },

  async getLibrary({ limit = 50, offset = 0 } = {}) {
    try {
      const db = getDb();
      if (db && typeof db.getAllAsync === 'function') {
        const rows = await db.getAllAsync('SELECT * FROM exercise_library ORDER BY name LIMIT ? OFFSET ?;', [limit, offset]);
        return rows.map(mapRowToExercise);
      }
      return [];
    } catch (err) {
      console.error('exerciseRepo.getLibrary error', err);
      return [];
    }
  },
};