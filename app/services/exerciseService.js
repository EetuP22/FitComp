const BASE = 'https://wger.de/api/v2';

async function safeFetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`wger API ${res.status} for ${url}`);
  return res.json();
}

const stripHtml = (html = '') =>
  (html || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();

export const exerciseService = {
  async fetchExercises({ search = '', muscle = null, page = 1, limit = 50 } = {}) {
    console.log(`🔍 fetchExercises called with:`, { search, muscle, page, limit });
    
    const params = new URLSearchParams();
    params.append('limit', String(200)); 
    if (muscle) params.append('muscles', String(muscle));

    const url = `${BASE}/exerciseinfo/?${params.toString()}`;
    console.log(`📡 Fetching from: ${url}`);
    
    try {
      const json = await safeFetchJson(url);
      console.log(`📦 Raw API response: ${json.results?.length || 0} exercises`);
      
      if (json.results && json.results.length > 0) {
        const first = json.results[0];
        console.log(`🔬 First exercise from exerciseinfo:`, {
          id: first.id,
          translations: first.translations?.length || 0,
          first_translation: first.translations?.[0]?.name,
        });
      }
      
      let exercises = (json.results || []).map((e) => {
        const englishTranslation = e.translations?.find(t => t.language === 2);
        
        if (!englishTranslation) {
          console.log(`⚠️ No English translation for exercise ${e.id}`);
          return null; 
        }
        
        const name = (englishTranslation.name || `Exercise ${e.id}`).trim();
        const description = stripHtml(englishTranslation.description || '');
        
        const muscleIds = Array.isArray(e.muscles) 
          ? e.muscles.map(m => typeof m === 'object' ? m.id : m)
          : [];
        
        const equipmentIds = Array.isArray(e.equipment)
          ? e.equipment.map(eq => typeof eq === 'object' ? eq.id : eq)
          : [];

        return {
          wger_id: e.id,
          name,
          description,
          muscles: muscleIds,
          equipment: equipmentIds,
          images: [], 
        };
      }).filter(e => e !== null); 
      
      if (search) {
        const searchLower = search.toLowerCase();
        exercises = exercises.filter(e => 
          e.name.toLowerCase().includes(searchLower) ||
          e.description.toLowerCase().includes(searchLower)
        );
      }
      
      console.log(`🔎 After filtering: ${exercises.length} exercises`);
      
      const start = (page - 1) * limit;
      const paginatedExercises = exercises.slice(start, start + limit);
      
      console.log(`📄 Returning page ${page}: ${paginatedExercises.length} exercises`);

      return { 
        results: paginatedExercises, 
        next: exercises.length > start + limit ? 'has_more' : null,
        count: exercises.length
      };
    } catch (error) {
      console.error('❌ wger API failed:', error.message);
      console.error('❌ Full error:', error);
      return { results: [], next: null, count: 0 };
    }
  },

  async fetchExerciseDetail(wgerId) {
    if (!wgerId) throw new Error('wgerId required');
    
    
    try {
      const url = `${BASE}/exerciseinfo/${wgerId}/`;
      const exercise = await safeFetchJson(url);
      
      
      const englishTranslation = exercise.translations?.find(t => t.language === 2);
      
      if (!englishTranslation) {
        throw new Error(`No English translation found for exercise ${wgerId}`);
      }
      
      let imageUrls = [];
      try {
        const imagesJson = await safeFetchJson(`${BASE}/exerciseimage/?exercise_base=${wgerId}`);
        imageUrls = (imagesJson.results || [])
          .map((img) => {
            const imgUrl = img.image;
            return imgUrl ? (imgUrl.startsWith('http') ? imgUrl : `https://wger.de${imgUrl}`) : null;
          })
          .filter(Boolean);
      } catch {
        imageUrls = [];
      }
      
      const muscleIds = Array.isArray(exercise.muscles) 
        ? exercise.muscles.map(m => typeof m === 'object' ? m.id : m)
        : [];
      
      const equipmentIds = Array.isArray(exercise.equipment)
        ? exercise.equipment.map(eq => typeof eq === 'object' ? eq.id : eq)
        : [];
      
      return {
        wger_id: exercise.id,
        name: (englishTranslation.name || '').trim() || `Exercise ${wgerId}`,
        description: stripHtml(englishTranslation.description || ''),
        muscles: muscleIds,
        equipment: equipmentIds,
        images: imageUrls,
      };
    } catch (err) {
      console.error(`Failed to fetch exercise detail for ${wgerId}:`, err.message);
      
      return {
        wger_id: wgerId,
        name: `Exercise ${wgerId}`,
        description: '',
        muscles: [],
        equipment: [],
        images: [],
      };
    }
  },

  async fetchMuscles() {
    const json = await safeFetchJson(`${BASE}/muscle/?limit=200`);
    return (json.results || [])
      .map((m) => ({ id: m.id, name: m.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  },
};