import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Loader2, CheckCircle, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import LocationSelector from '../components/LocationSelector';
import CropExplanationPanel from '../components/CropExplanationPanel';
import RiskAnalysisCard from '../components/RiskAnalysisCard';
import SoilTestingCard from '../components/SoilTestingCard';
import SoilImprovementCard from '../components/SoilImprovementCard';
import RevenueCard from '../components/RevenueCard';
import FeasibilityCard from '../components/FeasibilityCard';
import GovernmentSchemesCard from '../components/GovernmentSchemesCard';
import GrowingGuideCard from '../components/GrowingGuideCard';
import LabourPlannerCard from '../components/LabourPlannerCard';
import OrganicFarmingCard from '../components/OrganicFarmingCard';
import CropRecommendationCard from '../components/CropRecommendationCard';
import Sidebar from '../components/Sidebar';
import FeaturePanel from '../components/FeaturePanel';
import T from '../components/T';
import { useLanguage } from '../context/LanguageContext';

const API  = `${import.meta.env.VITE_API_URL}/api`;

const SOIL_TYPES = ['Clay', 'Sandy', 'Loamy', 'Black', 'Red', 'Alluvial'];

// Convert numeric weather values to descriptive levels (same logic as backend)
const toRainfallLevel  = mm  => mm  < 70  ? 'Low' : mm  < 170 ? 'Medium' : 'High';
const toHumidityLevel  = pct => pct < 35  ? 'Low' : pct < 75  ? 'Medium' : 'High';

const Recommend = () => {
    const { t } = useLanguage();

    // ── Location & weather ────────────────────────────────────────────────
    const [locationData, setLocationData] = useState(null);   // { lat, lon, weatherData }

    // ── Soil ─────────────────────────────────────────────────────────────
    const [manualSoil,  setManualSoil]  = useState('Loamy');

    // ── Result ───────────────────────────────────────────────────────────
    const [loading,  setLoading]  = useState(false);
    const [result,   setResult]   = useState(null);
    const [error,    setError]    = useState('');
    const [activeTab, setActiveTab] = useState('ai');

    // ── Additional cards ─────────────────────────────────────────────────
    const [riskData,        setRiskData]        = useState(null);
    const [soilTestData,    setSoilTestData]    = useState(null);
    const [improvementData, setImprovementData] = useState(null);
    const [feasibilityData, setFeasibilityData] = useState(null);
    const [schemesData,     setSchemesData]     = useState(null);
    const [growingData,     setGrowingData]     = useState(null);
    const [labourData,      setLabourData]      = useState(null);
    const [organicData,     setOrganicData]     = useState(null);

    const handleLocationSelect = (data) => {
        setLocationData(data);
        setResult(null);
        setError('');
    };

    const fetchAdditional = async (crop, confidence, soilType, weather) => {
        const rainfallLevel  = toRainfallLevel(weather.rainfall);
        const humidityLevel  = toHumidityLevel(weather.humidity);
        const season         = weather.season || 'Monsoon';

        const base = { crop, confidence, soil_type: soilType,
                        rainfall_level: rainfallLevel, humidity_level: humidityLevel,
                        season, temperature: weather.temperature };

        await Promise.allSettled([
            axios.post(`${API}/confidence-risk`,    base).then(r => setRiskData(r.data)).catch(() => {}),
            axios.post(`${API}/soil-test-advice`,   { soil_type: soilType, crop }).then(r => setSoilTestData(r.data)).catch(() => {}),
            axios.post(`${API}/soil-improvement`,   { crop, soil_type: soilType }).then(r => setImprovementData(r.data)).catch(() => {}),
            axios.post(`${API}/feasibility-report`, { crop, soil_type: soilType, season, rainfall_level: rainfallLevel, humidity_level: humidityLevel }).then(r => setFeasibilityData(r.data)).catch(() => {}),
            axios.post(`${API}/government-schemes`, { crop }).then(r => setSchemesData(r.data)).catch(() => {}),
            axios.post(`${API}/growing-guide`,      { crop, season }).then(r => setGrowingData(r.data)).catch(() => {}),
            axios.post(`${API}/labour-requirements`,{ crop, land_area_acres: 1, season }).then(r => setLabourData(r.data)).catch(() => {}),
            axios.post(`${API}/organic-farming`,    { crop, soil_type: soilType }).then(r => setOrganicData(r.data)).catch(() => {}),
        ]);
    };

    const handleSubmit = async () => {
        if (!locationData) {
            toast.error(t('navHome') === 'Home' ? 'Please select your location first.' : t('navHome'));
            toast.error('Please select your location first.');
            return;
        }
        setLoading(true);
        setError('');
        setResult(null);
        setRiskData(null); setSoilTestData(null); setImprovementData(null);
        setFeasibilityData(null); setSchemesData(null);
        setGrowingData(null); setLabourData(null); setOrganicData(null);

        try {
            const res = await axios.post(`${API}/recommend`, {
                location: { lat: locationData.lat, lon: locationData.lon },
                soil_mode:        'manual',
                manual_soil_type: manualSoil,
            }, { timeout: 30000 });

            const data = res.data;
            setResult(data);
            const crop       = data.crop || data.recommended_crops?.[0]?.crop;
            const confidence = data.confidence ?? data.recommended_crops?.[0]?.confidence ?? 0.8;
            const soilType   = data.soil_type || manualSoil;
            const weather    = data.weather || locationData.weatherData || {};
            toast.success(`🌾 Recommended: ${crop}!`);
            await fetchAdditional(crop, confidence, soilType, weather);
        } catch (err) {
            const msg = err.response?.data?.error || err.message || 'Recommendation failed.';
            setError(msg);
            toast.error('Recommendation failed. Check all servers are running.');
        } finally {
            setLoading(false);
        }
    };

    const crop       = result?.crop || result?.recommended_crops?.[0]?.crop;
    const confidence = result?.confidence ?? result?.recommended_crops?.[0]?.confidence ?? 0;
    const soilType   = result?.soil_type || manualSoil;
    const weather    = result?.weather || locationData?.weatherData || {};
    const rainfallLevel = toRainfallLevel(weather.rainfall ?? 140);
    const season     = result?.season || weather.season || 'Monsoon';

    return (
        <motion.div
            className="bg-brand-cream min-h-screen pt-24 pb-20"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
            <div className="max-w-4xl mx-auto px-4 md:px-8">

                {/* Page heading */}
                <div className="text-center mb-10">
                    <T as="h1" className="text-4xl md:text-5xl font-black text-brand-dark tracking-tight mb-2">
                        PRECISION ANALYSIS
                    </T>
                    <T as="p" className="text-brand-olive font-medium text-sm">
                        Find the optimal crop for your field through AI-powered environmental mapping.
                    </T>
                </div>

                {/* Input grid — Location + Soil */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Step 1: Location (GPS or manual) */}
                    <LocationSelector onLocationSelect={handleLocationSelect} loading={loading} />

                    {/* Step 2: Soil */}
                    <div className="bg-white rounded-3xl p-6 border border-brand-green/10 shadow-lg">
                        <h3 className="text-lg font-black text-brand-dark uppercase mb-4 flex items-center gap-2">
                            <Sprout size={20} className="text-brand-green" />
                            <T>Step 2 — Soil Type</T>
                        </h3>

                        {/* Soil Selection Dropdown */}
                        <div className="relative mb-5">
                            <select
                                value={manualSoil}
                                onChange={e => setManualSoil(e.target.value)}
                                className="w-full appearance-none px-4 py-3.5 rounded-xl border border-gray-200 bg-white font-bold text-brand-dark outline-none focus:border-brand-green transition-all"
                            >
                                {SOIL_TYPES.map(s => <option key={s} value={s}>{s} Soil</option>)}
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Weather snapshot (if location selected) */}
                        {locationData?.weatherData && (
                            <div className="mt-5 p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                                <T as="p" className="text-[10px] uppercase font-black text-brand-dark/40 tracking-widest mb-3">Weather Preview</T>
                                <div className="grid grid-cols-3 gap-3 text-center">
                                    <div>
                                        <p className="text-2xl font-black text-brand-dark">{Math.round(locationData.weatherData.temperature)}°</p>
                                        <T as="p" className="text-[10px] font-bold text-brand-olive uppercase">Temp</T>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-brand-dark">{locationData.weatherData.humidity}%</p>
                                        <T as="p" className="text-[10px] font-bold text-brand-olive uppercase">Humidity</T>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-brand-dark">{locationData.weatherData.rainfall}</p>
                                        <T as="p" className="text-[10px] font-bold text-brand-olive uppercase">mm Rain</T>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit button */}
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={loading || !locationData}
                    className="w-full py-5 bg-brand-dark text-white font-black text-base uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all mb-4"
                >
                    {loading
                        ? <><Loader2 className="animate-spin" size={20} /><T>Analyzing your field…</T></>
                        : <><Sprout size={20} /><T>Get Best Crop Match</T></>
                    }
                </motion.button>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-sm font-bold rounded-2xl mb-8">
                        ⚠️ {error}
                    </div>
                )}

            </div>

            {/* Results Container - Wide Layout */}
            <div className="w-full max-w-[100rem] mx-auto px-4 md:px-8 xl:px-12">
                {/* Results */}
                <AnimatePresence>
                    {result && crop && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <CropRecommendationCard 
                                crop={crop} 
                                confidence={confidence} 
                                season={season} 
                                result={result} 
                            />

                            {/* Dashboard Sidebar & Feature Panel */}
                            <div className="flex flex-col md:flex-row gap-6 md:gap-8 mt-8">
                                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                                <FeaturePanel activeTab={activeTab}>
                                    {activeTab === 'ai' && result.explanation && (
                                        <div id="soil-explanation-panel">
                                            <CropExplanationPanel
                                                crop={crop}
                                                confidence={confidence}
                                                explanation={result.explanation}
                                                inputs={{ soil_type: soilType, season }}
                                                mapped_values={result.mapped_values}
                                            />
                                        </div>
                                    )}
                                    {activeTab === 'risk' && <RiskAnalysisCard riskData={riskData} cropName={crop} />}
                                    {activeTab === 'soil_test' && <SoilTestingCard soilTestData={soilTestData} soilType={soilType} />}
                                    {activeTab === 'soil_improve' && <SoilImprovementCard improvementData={improvementData} />}
                                    {activeTab === 'revenue' && <RevenueCard crop={crop} rainfall={rainfallLevel} season={season} />}
                                    {activeTab === 'feasibility' && <FeasibilityCard reportData={feasibilityData} cropName={crop} />}
                                    {activeTab === 'schemes' && <GovernmentSchemesCard schemesData={schemesData} cropName={crop} />}
                                    {activeTab === 'guide' && <GrowingGuideCard guideData={growingData} cropName={crop} />}
                                    {activeTab === 'labour' && <LabourPlannerCard labourData={labourData} />}
                                    {activeTab === 'organic' && <OrganicFarmingCard organicData={organicData} cropName={crop} />}
                                </FeaturePanel>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default Recommend;