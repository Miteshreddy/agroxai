const express = require('express');
const router = express.Router();
const axios = require('axios');

// ============================================
// CLIMATE CROP MAP
// ============================================
const CLIMATE_CROP_MAP = {
    "tropical": ["rice", "banana", "coconut", "papaya", "coffee", "jute", "rubber", "tea", "mango", "pomegranate"],
    "semi_arid": ["cotton", "pigeonpeas", "maize", "sorghum", "millets", "groundnut", "sunflower", "soybean", "castor"],
    "temperate": ["apple", "grapes", "orange", "pear", "peach", "cherry", "plum", "walnut", "almond", "wheat", "barley"],
    "arid": ["date palm", "cactus", "agave", "jojoba", "moongbean"]
};

// WMO Weather Code → Description
const WMO_CODES = {
    0: 'clear sky', 1: 'mainly clear', 2: 'partly cloudy', 3: 'overcast',
    45: 'foggy', 48: 'depositing rime fog',
    51: 'light drizzle', 53: 'moderate drizzle', 55: 'dense drizzle',
    61: 'slight rain', 63: 'moderate rain', 65: 'heavy rain',
    71: 'slight snow fall', 73: 'moderate snow fall', 75: 'heavy snow fall',
    80: 'light showers', 81: 'moderate showers', 82: 'heavy showers',
    95: 'thunderstorm', 96: 'thunderstorm with hail', 99: 'thunderstorm with heavy hail'
};

function determineClimateZone(temperature, rainfall) {
    if (temperature > 28 && rainfall > 150) return 'tropical';
    if (temperature > 30 && rainfall < 50) return 'arid';
    if (temperature < 22) return 'temperate';
    return 'semi_arid';
}

function getCurrentSeason() {
    const month = new Date().getMonth() + 1; // 1-indexed
    if (month >= 3 && month <= 5) return 'Summer';
    if (month >= 6 && month <= 9) return 'Monsoon';
    if (month >= 10 && month <= 11) return 'Post-Monsoon';
    return 'Winter';
}

// ============================================
// ROUTE 1: Get weather from coordinates
// Uses Open-Meteo (free, no API key required)
// ============================================
router.get('/weather', async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    try {
        // 1. Fetch weather from Open-Meteo
        const weatherRes = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
            `&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code` +
            `&daily=precipitation_sum&timezone=auto&forecast_days=1`,
            { timeout: 10000 }
        );
        const d = weatherRes.data;
        const temperature = d.current.temperature_2m;
        const apparent_temperature = d.current.apparent_temperature;
        const humidity = d.current.relative_humidity_2m;

        // Use today's daily precipitation sum as rainfall (more meaningful than hourly)
        const rainfall = Math.round((d.daily?.precipitation_sum?.[0] ?? d.current.precipitation ?? 0) * 10) / 10;
        const weather_description = WMO_CODES[d.current.weather_code] || 'clear sky';
        console.log(`[Weather] lat=${lat} lon=${lon} → temp=${temperature}°C feels=${apparent_temperature}°C humidity=${humidity}% rainfall=${rainfall}mm`);

        // 2. Reverse geocode for city name using Nominatim (OpenStreetMap, free)
        let city = 'Your Location';
        let country = 'IN';
        try {
            const revGeo = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10&addressdetails=1`,
                { headers: { 'User-Agent': 'AGRO.XAI/1.0 (crop recommendation app)' }, timeout: 6000 }
            );
            const addr = revGeo.data?.address || {};
            // Broad fallback chain — covers metros, towns, rural areas across India
            city = addr.city
                || addr.town
                || addr.municipality
                || addr.city_district
                || addr.suburb
                || addr.village
                || addr.hamlet
                || addr.county
                || addr.state_district
                || addr.state
                || 'Your Location';
            country = (addr.country_code || 'in').toUpperCase();
            console.log(`[Geocode] city resolved as: "${city}" from addr keys: ${Object.keys(addr).join(', ')}`);
        } catch (geoErr) {
            console.warn('[Geocode] Reverse geocoding failed:', geoErr.message);
        }

        const climateZone = determineClimateZone(temperature, rainfall);
        const season = getCurrentSeason();

        res.json({
            temperature: Math.round(temperature * 10) / 10,
            apparent_temperature: apparent_temperature != null ? Math.round(apparent_temperature * 10) / 10 : null,
            humidity,
            rainfall,
            climate_zone: climateZone,
            season,
            suitable_crops: CLIMATE_CROP_MAP[climateZone] || [],
            location: { city, country },
            weather_description
        });
    } catch (err) {
        console.error('[Weather] Open-Meteo API error:', err.message, '| lat:', lat, 'lon:', lon);
        const season = getCurrentSeason();
        // Return sensible fallback so the app doesn't break
        res.json({
            temperature: null,
            apparent_temperature: null,
            humidity: null,
            rainfall: 0,
            climate_zone: 'semi_arid',
            season,
            suitable_crops: CLIMATE_CROP_MAP['semi_arid'],
            location: { city: 'Unknown', country: 'IN' },
            weather_description: 'unavailable',
            is_fallback: true
        });
    }
});

// ============================================
// ROUTE 2: Geocode address → coordinates
// Uses Nominatim / OpenStreetMap (free, no API key)
// 5-strategy multi-attempt approach for Indian districts
// ============================================
router.get('/geocode', async (req, res) => {
    const { state, district, village } = req.query;
    if (!state && !district && !village) {
        return res.status(400).json({ error: 'At least one of state, district, or village is required' });
    }

    const HEADERS = { 'User-Agent': 'AGRO.XAI/1.0 (crop recommendation app)' };

    // Prefer district-level administrative boundaries over talukas/villages
    const pickBest = (results) => {
        if (!results || results.length === 0) return null;
        const admins = results.filter(r => r.class === 'boundary' && r.type === 'administrative');
        if (admins.length > 0) {
            // admin_level 5 or 6 = district in India; prefer that over subdistrict (7/8)
            const districtLevel = admins.find(r => parseInt(r.admin_level) <= 6);
            return districtLevel || admins[0];
        }
        return results[0];
    };

    // Helper: call Nominatim search with given params
    const nominatim = async (params, timeout = 9000) => {
        const qs = new URLSearchParams({
            format: 'json', limit: '5', addressdetails: '1', countrycodes: 'in', ...params
        }).toString();
        const r = await axios.get(`https://nominatim.openstreetmap.org/search?${qs}`, { headers: HEADERS, timeout });
        return r.data || [];
    };

    try {
        let best = null;
        const tried = [];

        // Strategy 1: Nominatim structured params (county = district, state = state)
        if (district && state) {
            tried.push('structured');
            const r1 = await nominatim({ county: district, state, country: 'India' }).catch(() => []);
            best = pickBest(r1);
            if (!best) {
                // Add "District" suffix — common in OSM data for Indian districts
                const r2 = await nominatim({ county: `${district} District`, state, country: 'India' }).catch(() => []);
                best = pickBest(r2);
            }
        }

        // Strategy 2: Structured with village/city included
        if (!best && village && (district || state)) {
            tried.push('structured-village');
            const r = await nominatim({ city: village, county: district, state, country: 'India' }).catch(() => []);
            best = pickBest(r);
        }

        // Strategy 3: Free-text with "District" keyword appended
        if (!best && district) {
            tried.push('freetext-district-suffix');
            const q = [village, `${district} District`, state, 'India'].filter(Boolean).join(', ');
            const r = await nominatim({ q }).catch(() => []);
            best = pickBest(r);
        }

        // Strategy 4: Plain free-text (original approach)
        if (!best) {
            tried.push('freetext-plain');
            const q = [village, district, state, 'India'].filter(Boolean).join(', ');
            const r = await nominatim({ q }).catch(() => []);
            best = pickBest(r);
        }

        // Strategy 5: State-only last resort
        if (!best && state) {
            tried.push('state-only');
            const r = await nominatim({ state, country: 'India' }).catch(() => []);
            best = pickBest(r);
        }

        console.log(`[Geocode] strategies: ${tried.join('→')} | result: ${best ? best.display_name : 'NOT FOUND'}`);

        if (!best) {
            return res.status(404).json({ error: 'Location not found. Please check the spelling and try again.' });
        }

        res.json({
            latitude: parseFloat(best.lat),
            longitude: parseFloat(best.lon),
            formatted_address: best.display_name,
            state, district, village
        });
    } catch (err) {
        console.error('[Geocode] Error:', err.message);
        res.json({ latitude: 20.5937, longitude: 78.9629, formatted_address: 'India (fallback)', is_fallback: true });
    }
});

// ============================================
// ROUTE 3: Soil data from SoilGrids API + Geographical Mapping
// ============================================

const STATE_SOIL_MAP = {
    'maharashtra': 'Black',
    'gujarat': 'Black',
    'madhya pradesh': 'Black',
    'karnataka': 'Red',
    'andhra pradesh': 'Red',
    'telangana': 'Black',
    'tamil nadu': 'Red',
    'odisha': 'Red',
    'chhattisgarh': 'Red',
    'jharkhand': 'Red',
    'uttar pradesh': 'Alluvial',
    'punjab': 'Alluvial',
    'haryana': 'Alluvial',
    'bihar': 'Alluvial',
    'west bengal': 'Alluvial',
    'assam': 'Alluvial',
    'rajasthan': 'Sandy',
    'kerala': 'Loamy', // Laterite usually, but Loamy is a safe ML substitute
    'uttarakhand': 'Loamy',
    'himachal pradesh': 'Loamy'
};

router.get('/soil', async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    try {
        let soilType = 'Loamy'; // base fallback
        let ph = 7.0;
        let nitrogen = 0.5;

        // 1. Geography-based soil mapping (Primary for Indian regions)
        try {
            const revGeo = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10&addressdetails=1`,
                { headers: { 'User-Agent': 'AGRO.XAI/1.0 (soil map)' }, timeout: 5000 }
            );
            const state = revGeo.data?.address?.state?.toLowerCase();
            if (state) {
                // Find matching state in our map
                const matchedState = Object.keys(STATE_SOIL_MAP).find(k => state.includes(k));
                if (matchedState) {
                    soilType = STATE_SOIL_MAP[matchedState];
                    console.log(`[Soil Map] Geography matched: ${state} -> ${soilType} Soil`);
                }
            }
        } catch (geoErr) {
            console.warn('[Soil Map] Geocoding for soil failed:', geoErr.message);
        }

        // 2. SoilGrids API for pH, Nitrogen, and fallback texture
        try {
            const soilRes = await axios.get(
                `https://rest.soilgrids.org/soilgrids/v2.0/properties/query?lat=${lat}&lon=${lon}&depths=0-30cm&properties=clay,silt,sand,phh2o,cec,nitrogen`,
                { timeout: 7000 }
            );
            const data = soilRes.data;

            if (data.properties?.phh2o) {
                const phVals = data.properties.phh2o?.layers?.[0]?.values;
                if (phVals) {
                    const vals = Object.values(phVals);
                    ph = Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
                }
            }

            if (data.properties?.nitrogen) {
                const nVals = data.properties.nitrogen?.layers?.[0]?.values;
                if (nVals) nitrogen = Object.values(nVals).reduce((a, b) => a + b, 0) / Object.values(nVals).length;
            }

            // Only use SoilGrids texture if geographic mapping failed
            if (soilType === 'Loamy' && data.properties?.clay && data.properties?.sand) {
                const clayVals = data.properties.clay?.layers?.[0]?.values;
                const sandVals = data.properties.sand?.layers?.[0]?.values;
                if (clayVals && sandVals) {
                    const clay = Object.values(clayVals).reduce((a, b) => a + b, 0) / Object.values(clayVals).length;
                    const sand = Object.values(sandVals).reduce((a, b) => a + b, 0) / Object.values(sandVals).length;
                    if (clay > 40) soilType = 'Clay';
                    else if (sand > 60) soilType = 'Sandy';
                }
            }
        } catch (sgErr) {
            console.warn('[Soil Map] SoilGrids API failed, using geographic/fallback:', sgErr.message);
        }

        res.json({
            soil_type: soilType,
            ph, nitrogen: Math.round(nitrogen * 100) / 100,
            depth: '0-30cm'
        });
    } catch (err) {
        console.error('Soil API master error:', err.message);
        res.json({ soil_type: 'Loamy', ph: 7.0, nitrogen: 0.5, depth: '0-30cm', is_fallback: true });
    }
});

// ============================================
// ROUTE 4: Climate-based crop filter
// ============================================
router.post('/filter-crops', (req, res) => {
    try {
        const { crops, temperature, rainfall } = req.body;
        if (!crops || !Array.isArray(crops)) {
            return res.status(400).json({ error: 'Crops array is required' });
        }

        const climateZone = determineClimateZone(temperature || 25, rainfall || 100);
        const suitableCrops = CLIMATE_CROP_MAP[climateZone] || [];
        const filteredCrops = crops.filter(crop =>
            suitableCrops.some(s =>
                crop.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(crop.toLowerCase())
            )
        );

        res.json({
            original_crops: crops,
            filtered_crops: filteredCrops.length > 0 ? filteredCrops : crops,
            climate_zone: climateZone,
            suitable_crops: suitableCrops
        });
    } catch (err) {
        console.error('Filter error:', err.message);
        res.status(500).json({ error: 'Failed to filter crops' });
    }
});

module.exports = router;
