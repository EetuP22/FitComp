import { getDb } from '../db/database';
import { exerciseService } from '../services/exerciseService';

// Mapataan tietokantarivi harjoitusobjektiksi
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

// Määritellään harjoitusrepositorio harjoitusten käsittelyyn
export const exerciseRepo = {
  async getExercises({ search = '', muscle = null, page = 1, limit = 30 } = {}) {
    try {
      const res = await exerciseService.fetchExercises({ search, muscle, page, limit });
      const db = getDb();

      // Hae harjoitukset palvelusta ja tallenna ne paikalliseen tietokantaan
      if (db && typeof db.runAsync === 'function') {
        for (const item of res.results) {
          const id = `wger-${item.wger_id}`;
          const nameSafe = (item.name || `Exercise ${item.wger_id}`).trim() || `Exercise ${item.wger_id}`;
          
          try {
            await db.runAsync(
              `INSERT OR REPLACE INTO exercise_library
               (id, wger_id, name, description, muscles, equipment, images, videos, source, last_fetched)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                id,
                item.wger_id,
                nameSafe,
                item.description || '',
                JSON.stringify(item.muscles || []),
                JSON.stringify(item.equipment || []),
                JSON.stringify(item.images || []), 
                JSON.stringify([]),
                'wger',
                Date.now(),
              ]
            );
          } catch (e) {
            console.warn('exerciseRepo upsert failed', id, e?.message);
          }
        }
      }

      // Mapataan palvelun vastaus harjoitusobjekteiksi
      const mapped = (res.results || []).map((r) => ({
        id: `wger-${r.wger_id}`,
        wger_id: r.wger_id,
        name: (r.name || `Exercise ${r.wger_id}`).trim(),
        description: r.description || '',
        muscles: r.muscles || [],
        equipment: r.equipment || [],
        images: r.images || [], 
      }));
      
      return mapped;
    } catch (error) {
      console.error('exerciseRepo.getExercises error:', error);
      return [];
    }
  },

  // Lisää mukautettu harjoitus paikalliseen tietokantaan
  async getExerciseById(localId) {
    const db = getDb();

    if (db && typeof db.getFirstAsync === 'function') {
      const row = await db.getFirstAsync('SELECT * FROM exercise_library WHERE id = ?;', [localId]);
      if (row) return mapRowToExercise(row);
    }

    const wgerId = parseInt(String(localId).replace('wger-', ''), 10);
    const detail = await exerciseService.fetchExerciseDetail(wgerId);

    // Tallenna haettu harjoitus paikalliseen tietokantaan
    if (db && typeof db.runAsync === 'function') {
      try {
        await db.runAsync(
          `INSERT OR REPLACE INTO exercise_library
           (id, wger_id, name, description, muscles, equipment, images, videos, source, last_fetched)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            `wger-${detail.wger_id}`,
            detail.wger_id,
            (detail.name || `Exercise ${detail.wger_id}`).trim(),
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
        console.warn('exerciseRepo.persist detail failed', e?.message);
      }
    }

    // Palauta harjoitusobjekti
    return {
      id: `wger-${detail.wger_id}`,
      wger_id: detail.wger_id,
      name: (detail.name || `Exercise ${detail.wger_id}`).trim(),
      description: detail.description || '',
      muscles: detail.muscles || [],
      equipment: detail.equipment || [],
      images: detail.images || [],
      videos: [],
    };
  },
};