// Karttatipalvelu kuntosalien hakemiseen OpenStreetMapin Overpass API:n kautta
const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

// Laske maantieteellinen suorakulmio annetun pisteen ja säteen perusteella
const getBoundingBox = (latitude, longitude, radiusKm = 5) => {
  const latDelta = radiusKm / 111; // Noin 111 km per leveysaste
  const lngDelta =
    radiusKm / (111 * Math.cos((latitude * Math.PI) / 180));

  return {
    south: latitude - latDelta,
    west: longitude - lngDelta,
    north: latitude + latDelta,
    east: longitude + lngDelta,
  };
};

// Muodosta Overpassin bbox-merkkijono
const formatBbox = (bbox) =>
  `${bbox.south},${bbox.west},${bbox.north},${bbox.east}`;

// Rakenna Overpass-kysely kuntosalien hakemiseen
const buildOverpassQuery = (bbox) => {
  return `
    [out:json][timeout:25][bbox:${formatBbox(bbox)}];
    (
      node["leisure"="fitness_centre"];
      way["leisure"="fitness_centre"];
      node["leisure"="gym"];
      way["leisure"="gym"];
      node["amenity"="gym"];
      way["amenity"="gym"];
    );
    out body geom;
  `;
};

// Jäsennä Overpassin vastaus ja muodosta kuntosalien lista
const parseOsmData = (data, userLat, userLng) => {
  const gyms = [];
  const processedIds = new Set();

  const calculateDistance = (lat, lng) => {
    const R = 6371;
    const dLat = ((lat - userLat) * Math.PI) / 180;
    const dLng = ((lng - userLng) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((userLat * Math.PI) / 180) *
        Math.cos((lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Käy läpi kaikki elementit ja muodosta kuntosaliobjektit
  if (data.elements) {
    data.elements.forEach((element) => {
      if (processedIds.has(element.id)) return;

      let lat, lng;

      if (element.type === "node") {
        lat = element.lat;
        lng = element.lon;
      } else if (element.type === "way" && element.geometry) {
        lat = element.geometry[0]?.lat;
        lng = element.geometry[0]?.lon;
      }

      if (!lat || !lng) return;

      const name =
        element.tags?.name ||
        element.tags?.operator ||
        "Tuntematon kuntosali";

      const address =
        element.tags?.["addr:street"] &&
        element.tags?.["addr:housenumber"]
          ? `${element.tags["addr:street"]} ${element.tags["addr:housenumber"]}, ${
              element.tags["addr:city"] || "Suomi"
            }`
          : element.tags?.["addr:city"] || "Osoite tuntematon";

      const distance = calculateDistance(lat, lng);

      // Lisää kuntosali, jos se on määritellyn säteen sisällä
      if (distance <= 25) {
        gyms.push({
          id: `osm-${element.id}`,
          name,
          latitude: lat,
          longitude: lng,
          address,
          distance: parseFloat(distance.toFixed(1)),
          rating: 4.0,
          facilities: ["Kuntosali"],
        });

        processedIds.add(element.id);
      }
    });
  }
  // Palauta kuntosalit etäisyyden mukaan lajiteltuna
  return gyms.sort((a, b) => a.distance - b.distance);
};

// Gym-palvelu kuntosalien hakemiseen Overpass API:sta
export const gymService = {
  async searchGymsNearby(latitude, longitude, radiusKm = 5) {
    try {
      const bbox = getBoundingBox(latitude, longitude, radiusKm);
      const query = buildOverpassQuery(bbox);

      const response = await fetch(OVERPASS_API, {
        method: "POST",
        body: query, 
        headers: {
          "Content-Type": "text/plain",
          Accept: "application/json",
        },
      });

      const text = await response.text();

      if (text.trim().startsWith("<")) {
        throw new Error("Overpass returned HTML instead of JSON (rate limit or malformed query)");
      }

      const data = JSON.parse(text);
      const gyms = parseOsmData(data, latitude, longitude);

      return gyms.slice(0, 20);
    } catch (err) {
      console.error("gymService.searchGymsNearby error", err);
      throw err;
    }
  },

  // Hae kuntosaleja nimen perusteella tietyltä alueelta
  async searchGymsByName(query, latitude, longitude, radiusKm = 10) {
    try {
      const bbox = getBoundingBox(latitude, longitude, radiusKm);
      const overpassQuery = buildOverpassQuery(bbox);

      const response = await fetch(OVERPASS_API, {
        method: "POST",
        body: overpassQuery,
        headers: {
          "Content-Type": "text/plain",
          Accept: "application/json",
        },
      });

      const text = await response.text();

      // Tarkista, onko vastaus HTML (esim. virhesivu)
      if (text.trim().startsWith("<")) {
        throw new Error("Overpass returned HTML instead of JSON (rate limit or malformed query)");
      }

      const data = JSON.parse(text);
      const allGyms = parseOsmData(data, latitude, longitude);

      // Suodata kuntosalit nimen perusteella
      return allGyms.filter(
        (gym) =>
          gym.name.toLowerCase().includes(query.toLowerCase()) ||
          gym.address.toLowerCase().includes(query.toLowerCase())
      );
    } catch (err) {
      console.error("gymService.searchGymsByName error", err);
      throw err;
    }
  },
};
