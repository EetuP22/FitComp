const BASE = 'https://wger.de/api/v2';

async function safeFetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`wger API ${res.status}`);
  return res.json();
}

export const exerciseService = {
  async fetchExercises({ search = '', muscle = null, page = 1, limit = 20 } = {}) {
    const params = new URLSearchParams();
    params.append('language', '2');
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (search) params.append('search', search);
    if (muscle) params.append('muscles', String(muscle));

    const url = `${BASE}/exercise/?${params.toString()}`;
    const json = await safeFetchJson(url);
    return {
      results: (json.results || []).map((e) => ({
        wger_id: e.id,
        name: e.name,
        description: e.description,
        muscles: e.muscles || [],
        equipment: e.equipment || [],
        language: e.language,
      })),
      next: json.next,
      count: json.count,
    };
  },

  async fetchExerciseDetail(wgerId) {
    if (!wgerId) throw new Error('wgerId required');
    const url = `${BASE}/exercise/${wgerId}/?language=2`;
    const detail = await safeFetchJson(url);
    const imagesJson = await safeFetchJson(`${BASE}/exerciseimage/?exercise=${wgerId}`);
    const imageUrls = (imagesJson.results || []).map((img) => img.image).filter(Boolean);
    return {
      wger_id: detail.id,
      name: detail.name,
      description: detail.description,
      muscles: detail.muscles || [],
      equipment: detail.equipment || [],
      images: imageUrls,
    };
  },

  async fetchMuscles() {
    const url = `${BASE}/muscle/`;
    const json = await safeFetchJson(url);
    return (json.results || []).map((m) => ({ id: m.id, name: m.name }));
  },
};