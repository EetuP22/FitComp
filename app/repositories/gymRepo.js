import { getDb } from '../db/database';

// Muuttuja muistissa oleville suosikeille, jos tietokantaa ei ole käytettävissä
let memoryFavorites = [];

// Mapataan tietokantarivi kuntosaliobjektiksi
const mapRowToGym = (row) => ({
    id: row.id,
    name: row.name,
    latitude: row.latitude,
    longitude: row.longitude,
    address: row.address,
    distance: row.distance,
    facilities: row.facilities ? JSON.parse(row.facilities) : [],
});

// Määritellään kuntosalirepositorio kuntosalien käsittelyyn
export const gymRepo = {
  async saveFavoriteGym(gym) {
    try {
    const db = getDb(); 
      if (db && typeof db.runAsync === 'function') {
        const result = await db.runAsync(
          `INSERT OR REPLACE INTO favorite_gyms (id, name, latitude, longitude, address, distance, facilities) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            gym.id,
            gym.name,
            gym.latitude,
            gym.longitude,
            gym.address,
            gym.distance,
            JSON.stringify(gym.facilities || []),
          ]
        );
        return result;
      }

      // Jos tietokantaa ei ole, tallenna muistiin
      const idx = memoryFavorites.findIndex((f) => f.id === gym.id);
      const copy = { ...gym, facilities: gym.facilities || [] };
      if (idx >= 0) memoryFavorites[idx] = copy;
      else memoryFavorites.push(copy);
      return true;
    } catch (err) {
      console.error('gymRepo.saveFavoriteGym error', err);
      throw err;
    }
  },

 // Poista kuntosali suosikeista
  async removeFavoriteGym(gymId) {
    try {
        const db = getDb();
      if (db && typeof db.runAsync === 'function') {
        await db.runAsync('DELETE FROM favorite_gyms WHERE id = ?', [gymId]);
        return;
      }
      memoryFavorites = memoryFavorites.filter((f) => f.id !== gymId);
      return;
    } catch (err) {
      console.error('gymRepo.removeFavoriteGym error', err);
      throw err;
    }
  },

  // Hae kaikki suosikkikuntosalit
  async getAllFavoriteGyms() {
    try {
        const db = getDb();
      if (db && typeof db.getAllAsync === 'function') {
        const result = await db.getAllAsync('SELECT * FROM favorite_gyms ORDER BY name ASC');
        return result.map(mapRowToGym);
      }
      return memoryFavorites.slice();
    } catch (err) {
      console.error('gymRepo.getAllFavoriteGyms error', err);
      return [];
    }
  },

  // Tarkista, onko kuntosali suosikeissa
  async isFavorited(gymId) {
    try {
        const db = getDb();
      if (db && typeof db.getFirstAsync === 'function') {
        const result = await db.getFirstAsync('SELECT id FROM favorite_gyms WHERE id = ?', [gymId]);
        return !!result;
      }
      return memoryFavorites.some((f) => f.id === gymId);
    } catch (err) {
      console.error('gymRepo.isFavorited error', err);
      return false;
    }
  },
};