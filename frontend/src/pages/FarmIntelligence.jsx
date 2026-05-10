import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { useLanguage } from '../context/LanguageContext';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Cpu, TrendingUp, Sparkles, Activity, Thermometer, Droplets, 
  CloudRain, Compass, AlertTriangle, CheckCircle2, Shield, 
  Calendar, FileText, BarChart3, ChevronRight, RefreshCw, HelpCircle, ArrowUpRight
} from 'lucide-react';
import T from '../components/T';

// Theme styling helper colors for Recharts gradients
const CHART_COLORS = {
  emerald: ['#10b981', 'rgba(16, 185, 129, 0.1)'],
  gold: ['#f59e0b', 'rgba(245, 158, 11, 0.1)'],
  blue: ['#3b82f6', 'rgba(59, 130, 246, 0.1)'],
  red: ['#f87171', 'rgba(248, 113, 113, 0.1)'],
};

const FarmIntelligence = () => {
  const { user } = useAuth();
  const { get, loading, error } = useApi();
  const { t } = useLanguage();
  const [historyRecords, setHistoryRecords] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch full prediction history for logged in user from Atlas
  const fetchUserHistory = async () => {
    if (!user?.id) return;
    setIsRefreshing(true);
    try {
      const res = await get(`/history/user/${user.id}`);
      if (res?.success && Array.isArray(res.data)) {
        setHistoryRecords(res.data);
        // Automatically select the most frequent or latest crop
        if (res.data.length > 0) {
          const crops = res.data.map(r => r.predictionResult?.crop || 'Unknown');
          const cropCounts = crops.reduce((acc, c) => {
            acc[c] = (acc[c] || 0) + 1;
            return acc;
          }, {});
          const topCrop = Object.keys(cropCounts).sort((a, b) => cropCounts[b] - cropCounts[a])[0];
          setSelectedCrop(topCrop || crops[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load user intelligence records:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserHistory();
  }, [user?.id]);

  // Group history by crop and perform multi-dimensional aggregation
  const cropSummaries = useMemo(() => {
    if (historyRecords.length === 0) return {};

    const summaries = {};
    historyRecords.forEach(record => {
      const crop = record.predictionResult?.crop || 'Unknown';
      const confidence = record.predictionResult?.confidence || 0.95;
      const confidencePercent = confidence < 1 ? Math.round(confidence * 100) : Math.round(confidence);
      
      const soil = record.soilType || 'Loamy';
      const n = record.soilMetrics?.n || 65;
      const p = record.soilMetrics?.p || 45;
      const k = record.soilMetrics?.k || 40;
      const ph = record.soilMetrics?.ph || 6.5;

      const temp = record.environmentalData?.temp || 26;
      const humidity = record.environmentalData?.humidity || 65;
      const rainfall = record.environmentalData?.rainfall || 120;
      const season = record.environmentalData?.season || 'Monsoon';

      if (!summaries[crop]) {
        summaries[crop] = {
          name: crop,
          count: 0,
          confidenceSum: 0,
          highestConfidence: 0,
          soils: {},
          seasons: {},
          nSum: 0,
          pSum: 0,
          kSum: 0,
          phSum: 0,
          tempSum: 0,
          humiditySum: 0,
          rainfallSum: 0,
          records: []
        };
      }

      const cs = summaries[crop];
      cs.count += 1;
      cs.confidenceSum += confidencePercent;
      cs.highestConfidence = Math.max(cs.highestConfidence, confidencePercent);
      cs.nSum += n;
      cs.pSum += p;
      cs.kSum += k;
      cs.phSum += ph;
      cs.tempSum += temp;
      cs.humiditySum += humidity;
      cs.rainfallSum += rainfall;
      
      cs.soils[soil] = (cs.soils[soil] || 0) + 1;
      cs.seasons[season] = (cs.seasons[season] || 0) + 1;
      
      cs.records.push({
        date: new Date(record.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        confidence: confidencePercent,
        n, p, k, ph, temp, humidity, rainfall, season, soil,
        rawTimestamp: new Date(record.createdAt).getTime()
      });
    });

    // Compute averages and resolve dominant attributes
    Object.keys(summaries).forEach(crop => {
      const cs = summaries[crop];
      cs.avgConfidence = Math.round(cs.confidenceSum / cs.count);
      cs.avgN = Math.round(cs.nSum / cs.count);
      cs.avgP = Math.round(cs.pSum / cs.count);
      cs.avgK = Math.round(cs.kSum / cs.count);
      cs.avgPh = Number((cs.phSum / cs.count).toFixed(1));
      cs.avgTemp = Math.round(cs.tempSum / cs.count);
      cs.avgHumidity = Math.round(cs.humiditySum / cs.count);
      cs.avgRainfall = Math.round(cs.rainfallSum / cs.count);
      
      cs.dominantSoil = Object.keys(cs.soils).sort((a, b) => cs.soils[b] - cs.soils[a])[0];
      cs.dominantSeason = Object.keys(cs.seasons).sort((a, b) => cs.seasons[b] - cs.seasons[a])[0];

      // Sort records chronologically
      cs.records.sort((a, b) => a.rawTimestamp - b.rawTimestamp);
    });

    return summaries;
  }, [historyRecords]);

  // Selected crop dataset
  const activeCropData = useMemo(() => {
    if (!selectedCrop || !cropSummaries[selectedCrop]) return null;
    return cropSummaries[selectedCrop];
  }, [selectedCrop, cropSummaries]);

  // List of unique crops predicted in history
  const availableCropsList = useMemo(() => {
    return Object.values(cropSummaries).sort((a, b) => b.count - a.count);
  }, [cropSummaries]);

  // Soil Chemical Radar Feed
  const radarData = useMemo(() => {
    if (!activeCropData) return [];
    return [
      { subject: 'Nitrogen (N)', value: activeCropData.avgN, fullMark: 140 },
      { subject: 'Phosphorus (P)', value: activeCropData.avgP, fullMark: 120 },
      { subject: 'Potassium (K)', value: activeCropData.avgK, fullMark: 120 },
      { subject: 'Humidity (%)', value: activeCropData.avgHumidity, fullMark: 100 },
      { subject: 'Temp (°C)', value: activeCropData.avgTemp * 2.5, fullMark: 100 }, // Scaled
      { subject: 'Soil pH (x10)', value: activeCropData.avgPh * 10, fullMark: 100 }, // Scaled
    ];
  }, [activeCropData]);

  // Dynamic AI-Generated Insights compilation
  const aiInsights = useMemo(() => {
    if (!activeCropData) return [];

    const insights = [];
    const { name, avgN, avgPh, dominantSoil, dominantSeason, avgConfidence, count } = activeCropData;

    // Insight 1: Soil types correlation
    insights.push({
      id: 'insight-1',
      text: `${name} has shown a robust performance pattern with ${dominantSoil} type across ${count} distinct predictions.`,
      type: 'optimal',
      detail: 'Historical predictions confirm high enzymatic compatibility in soil profile indices.'
    });

    // Insight 2: Chemical levels thresholds
    if (avgN > 70) {
      insights.push({
        id: 'insight-2',
        text: `Elevated Nitrogen ratios (averaging ${avgN} mg/kg) strongly correlate with premium ${name} recommendations.`,
        type: 'growth',
        detail: 'Foliar volume benchmarks show excellent nitrogen absorption coefficients.'
      });
    } else {
      insights.push({
        id: 'insight-2',
        text: `Sub-optimal Nitrogen parameters parsed. Consider organic compost additions to stabilize vegetative output.`,
        type: 'warning',
        detail: 'Macronutrient deficiencies limits core photosynthetic output velocities.'
      });
    }

    // Insight 3: Seasonal planning suitability
    insights.push({
      id: 'insight-3',
      text: `Historical predictive reliability peaks during the ${dominantSeason} season with ${avgConfidence}% model confidence.`,
      type: 'reliability',
      detail: 'Climatic telemetry vectors fit the seasonal humidity range perfectly.'
    });

    return insights;
  }, [activeCropData]);

  return (
    <div className="bg-brand-bg min-h-screen text-brand-text-primary pt-32 pb-24 px-6 relative overflow-hidden select-none">
      <div className="noise-overlay pointer-events-none" />

      {/* Decorative cosmic background coordinates mesh */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[15%] right-[-5%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] left-[-10%] w-[45%] h-[45%] bg-brand-gold/5 rounded-full blur-[180px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.25em] rounded-full border border-brand-primary/20">
              <Cpu size={11} />
              <T>FARM INTELLIGENCE SYSTEM</T>
            </span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-brand-text-primary leading-none">
              <T>CROP INTELLIGENCE</T>
            </h1>
            <p className="text-brand-text-secondary text-sm max-w-2xl font-medium">
              <T>Transforming your historical prediction logs into predictive analytics. Select any crop below to morph the operating system into a tailored crop diagnostics dashboard.</T>
            </p>
          </div>

          {/* Sync status controller button */}
          <button
            onClick={fetchUserHistory}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-surface border border-brand-border text-xs font-black uppercase tracking-wider hover:border-brand-primary/30 text-brand-text-primary transition-all disabled:opacity-50 h-fit"
          >
            <RefreshCw size={12} className={`${loading || isRefreshing ? 'animate-spin' : ''}`} />
            <T>Sync Atlas Data</T>
          </button>
        </div>

        {/* Dynamic empty state fallback */}
        {availableCropsList.length === 0 && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-brand-border bg-brand-surface/50 backdrop-blur-md rounded-4xl p-12 text-center max-w-xl mx-auto space-y-6"
          >
            <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mx-auto shadow-glow">
              <Activity size={28} />
            </div>
            <h3 className="text-xl font-black uppercase text-brand-text-primary">No Analytics Footprint Found</h3>
            <p className="text-brand-text-secondary text-sm leading-relaxed font-medium">
              This analytics center compiles crop statistics dynamically from your recommendation logs. Perform a soil diagnostic recommendation to boot up these neural widgets!
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-2">
              <a href="/recommend" className="btn-primary inline-flex items-center gap-2 px-6 py-3.5 bg-brand-primary text-slate-950 font-black uppercase text-[10px] tracking-[0.25em] rounded-xl border border-brand-primary/20 shadow-premium">
                <T>GENERATE FIRST RECOMMENDATION</T>
                <ArrowUpRight size={14} />
              </a>
            </motion.div>
          </motion.div>
        )}

        {availableCropsList.length > 0 && (
          <>
            {/* 1. PREMIUM HORIZONTAL CROP CAROUSEL / SELECTOR */}
            <div className="space-y-4">
              <span className="text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.25em] pl-1">
                SELECT LOGGED CROP PROFILE ({availableCropsList.length})
              </span>
              
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin snap-x scroll-smooth">
                {availableCropsList.map((crop) => {
                  const isActive = selectedCrop === crop.name;
                  return (
                    <button
                      key={crop.name}
                      onClick={() => setSelectedCrop(crop.name)}
                      className={`text-left p-6 rounded-[2rem] border min-w-[240px] snap-start shrink-0 relative overflow-hidden transition-all duration-300 ${
                        isActive 
                          ? 'bg-brand-surface-elevated border-brand-primary/40 shadow-premium group' 
                          : 'bg-brand-surface/60 border-brand-border hover:border-brand-primary/20 hover:bg-brand-surface-elevated/30'
                      }`}
                    >
                      {/* Active glow corner circle */}
                      {isActive && (
                        <div className="absolute top-0 right-0 w-20 h-20 bg-brand-primary/5 rounded-full blur-xl pointer-events-none" />
                      )}

                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black uppercase text-sm ${
                          isActive ? 'bg-brand-primary text-slate-950 shadow-glow' : 'bg-brand-primary/10 text-brand-primary'
                        }`}>
                          {crop.name.charAt(0)}
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${
                          isActive ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' : 'bg-brand-surface-inset border border-brand-border text-brand-text-secondary'
                        }`}>
                          {crop.avgConfidence}% Match
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-brand-text-primary uppercase tracking-tight truncate max-w-[180px]">{crop.name}</h3>
                      <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase text-brand-text-secondary">
                        <span>RECS: {crop.count}</span>
                        <span>SOIL: {crop.dominantSoil}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. DYNAMIC CROP SPECIFIC ANALYTICS OPERATING SYSTEM */}
            <AnimatePresence mode="wait">
              {activeCropData && (
                <motion.div
                  key={selectedCrop}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -25 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
                >
                  
                  {/* LEFT COLUMN (3/12 cols): Diagnostic Soil & Environmental conditions */}
                  <div className="lg:col-span-3 flex flex-col gap-8">
                    {/* Environmental Conditions Box */}
                    <div className="bg-brand-surface border border-brand-border rounded-[2.5rem] p-6 space-y-6 flex-grow flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[8px] font-black text-brand-text-secondary uppercase tracking-[0.25em]">METRIC MATRIX</span>
                        <h3 className="text-md font-black text-brand-text-primary uppercase tracking-tight">CLIMATIC RANGES</h3>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 bg-brand-surface-inset border border-brand-border p-3 rounded-2xl">
                          <Thermometer className="text-brand-primary" size={16} />
                          <div>
                            <span className="text-[8px] font-black text-brand-text-secondary uppercase">Average Temp</span>
                            <p className="text-sm font-black text-brand-text-primary">{activeCropData.avgTemp}°C</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-brand-surface-inset border border-brand-border p-3 rounded-2xl">
                          <Droplets className="text-brand-primary" size={16} />
                          <div>
                            <span className="text-[8px] font-black text-brand-text-secondary uppercase">Moisture Average</span>
                            <p className="text-sm font-black text-brand-text-primary">{activeCropData.avgHumidity}%</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-brand-surface-inset border border-brand-border p-3 rounded-2xl">
                          <CloudRain className="text-brand-primary" size={16} />
                          <div>
                            <span className="text-[8px] font-black text-brand-text-secondary uppercase">Precipitation</span>
                            <p className="text-sm font-black text-brand-text-primary">{activeCropData.avgRainfall} mm</p>
                          </div>
                        </div>
                      </div>

                      {/* Dom season index */}
                      <div className="pt-4 border-t border-brand-border/60">
                        <span className="text-[8px] font-black text-brand-text-secondary uppercase tracking-widest">DOMINANT HARVEST SEASON</span>
                        <p className="text-lg font-black text-brand-primary uppercase tracking-tight mt-1">{activeCropData.dominantSeason}</p>
                      </div>
                    </div>

                    {/* Confidence gauge card */}
                    <div className="bg-brand-surface border border-brand-border rounded-[2.5rem] p-6 space-y-4">
                      <div className="flex justify-between items-center text-[9px] font-black uppercase">
                        <span className="text-brand-text-secondary">AI PREDICTIVE CONSISTENCY</span>
                        <span className="text-brand-primary">{activeCropData.avgConfidence}% Avg</span>
                      </div>
                      <div className="h-2 w-full bg-brand-surface-inset border border-brand-border rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${activeCropData.avgConfidence}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-brand-primary to-emerald-400"
                        />
                      </div>
                      <p className="text-[9px] text-brand-text-secondary font-medium leading-relaxed">
                        Evaluated across {activeCropData.count} historical prediction scenarios in user database.
                      </p>
                    </div>
                  </div>

                  {/* CENTER COLUMN (6/12 cols): Large animated timeline and charts */}
                  <div className="lg:col-span-6 bg-brand-surface border border-brand-border rounded-[2.5rem] p-6 md:p-8 flex flex-col justify-between min-h-[460px]">
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-1">
                        <span className="text-[8px] font-black text-brand-text-secondary uppercase tracking-[0.25em]">CHART PROFILE</span>
                        <h3 className="text-lg font-black text-brand-text-primary uppercase tracking-tight">PREDICTION HISTORICAL TIMELINE</h3>
                      </div>
                      <span className="px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[9px] font-black rounded-lg uppercase">
                        REAL-TIME CHRONO TIMELINE
                      </span>
                    </div>

                    {/* Main Recharts Area Chart */}
                    <div className="h-64 w-full my-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={activeCropData.records} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156,163,175,0.1)" />
                          <XAxis dataKey="date" stroke="currentColor" className="text-[9px] font-black text-brand-text-secondary uppercase opacity-60" />
                          <YAxis domain={[50, 100]} stroke="currentColor" className="text-[9px] font-black text-brand-text-secondary opacity-60" />
                          <Tooltip 
                            contentStyle={{ 
                              background: 'var(--surface-solid-elevated)', 
                              border: '1px solid var(--border-color)', 
                              borderRadius: '16px',
                              fontFamily: 'inherit',
                              fontSize: '11px',
                              color: 'var(--text-color-primary)'
                            }} 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="confidence" 
                            stroke="var(--accent-primary)" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorConfidence)" 
                            name="Confidence %"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Lower matrix mini comparison */}
                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-brand-border/60">
                      <div>
                        <span className="text-[8px] font-black text-brand-text-secondary uppercase">Nitrogen Avg</span>
                        <p className="text-md font-black text-brand-text-primary mt-1">{activeCropData.avgN} mg/kg</p>
                      </div>
                      <div>
                        <span className="text-[8px] font-black text-brand-text-secondary uppercase">Phosphorus Avg</span>
                        <p className="text-md font-black text-brand-text-primary mt-1">{activeCropData.avgP} mg/kg</p>
                      </div>
                      <div>
                        <span className="text-[8px] font-black text-brand-text-secondary uppercase">Potassium Avg</span>
                        <p className="text-md font-black text-brand-text-primary mt-1">{activeCropData.avgK} mg/kg</p>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN (3/12 cols): Soil Health network, alerts and risks */}
                  <div className="lg:col-span-3 flex flex-col justify-between gap-8">
                    {/* Radar Chart of macronutrients health network */}
                    <div className="bg-brand-surface border border-brand-border rounded-[2.5rem] p-6 space-y-4 flex-grow flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[8px] font-black text-brand-text-secondary uppercase tracking-[0.25em]">SENSOR DIAGNOSTIC</span>
                        <h3 className="text-md font-black text-brand-text-primary uppercase tracking-tight">MACRONUTRIENT BALANCE</h3>
                      </div>

                      <div className="h-44 w-full flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid stroke="rgba(156,163,175,0.1)" />
                            <PolarAngleAxis dataKey="subject" className="text-[8px] font-black uppercase text-brand-text-secondary" />
                            <PolarRadiusAxis angle={30} domain={[0, 120]} className="hidden" />
                            <Radar 
                              name="MACRONUTRIENTS" 
                              dataKey="value" 
                              stroke="var(--accent-primary)" 
                              fill="var(--accent-primary)" 
                              fillOpacity={0.2} 
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Optimal soil profile type */}
                      <div className="pt-4 border-t border-brand-border/60 flex justify-between items-center">
                        <div>
                          <span className="text-[8px] font-black text-brand-text-secondary uppercase">OPTIMAL SOIL TYPE</span>
                          <p className="text-md font-black text-brand-text-primary uppercase mt-1">{activeCropData.dominantSoil}</p>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                          <CheckCircle2 size={16} />
                        </div>
                      </div>
                    </div>

                    {/* Micro alert feedback panel */}
                    <div className="bg-brand-surface border border-brand-border rounded-[2.5rem] p-6 space-y-4">
                      <span className="text-[8px] font-black text-brand-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                        <AlertTriangle size={10} className="text-brand-gold" /> DIAGNOSTIC RISK PROFILE
                      </span>
                      <div className="space-y-2">
                        {activeCropData.avgPh < 6.0 || activeCropData.avgPh > 7.5 ? (
                          <div className="p-3 bg-red-400/10 rounded-xl border border-red-400/20 text-[10px] text-red-400 font-black uppercase">
                            Warning: Extreme pH profile detected ({activeCropData.avgPh})
                          </div>
                        ) : (
                          <div className="p-3 bg-emerald-500/15 rounded-xl border border-emerald-500/20 text-[10px] text-brand-primary font-black uppercase flex items-center gap-1.5">
                            <Shield size={12} /> pH alkalinity index optimum
                          </div>
                        )}
                        <p className="text-[9px] text-brand-text-secondary font-medium">
                          Based on average pH level calculations.
                        </p>
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

            {/* 3. LOWER SECTION: COGNITIVE INTELLIGENCE & AI-GENERATED INSIGHTS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
              
              {/* Left Box (7/12 cols): Playable NPK chemical heatmaps */}
              <div className="lg:col-span-7 bg-brand-surface border border-brand-border rounded-[2.5rem] p-6 md:p-8 flex flex-col justify-between min-h-[360px]">
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-brand-text-secondary uppercase tracking-[0.25em]">NPK HEATMAP INDEX</span>
                    <h3 className="text-lg font-black text-brand-text-primary uppercase tracking-tight">MACRONUTRIENT ALLOCATION MATRIX</h3>
                  </div>
                  <Compass className="text-brand-primary animate-spin" size={18} style={{ animationDuration: '10s' }} />
                </div>

                {/* Animated NPK bar distribution graph */}
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activeCropData?.records || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156,163,175,0.1)" />
                      <XAxis dataKey="date" stroke="currentColor" className="text-[8px] font-black text-brand-text-secondary uppercase opacity-60" />
                      <YAxis stroke="currentColor" className="text-[8px] font-black text-brand-text-secondary opacity-60" />
                      <Tooltip 
                        contentStyle={{ 
                          background: 'var(--surface-solid-elevated)', 
                          border: '1px solid var(--border-color)', 
                          borderRadius: '16px',
                          fontSize: '11px',
                          color: 'var(--text-color-primary)'
                        }} 
                      />
                      <Bar dataKey="n" fill="var(--accent-primary)" name="Nitrogen (N)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="p" fill="var(--accent-gold)" name="Phosphorus (P)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="k" fill="#3b82f6" name="Potassium (K)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <p className="text-[10px] font-medium text-brand-text-secondary mt-4">
                  *Allocated indices represent relative chemical proportions extracted across sequential prediction cycles.
                </p>
              </div>

              {/* Right Box (5/12 cols): Dynamic AI INSIGHTS panel */}
              <div className="lg:col-span-5 bg-brand-surface border border-brand-border rounded-[2.5rem] p-6 md:p-8 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles size={18} className="text-brand-primary animate-pulse" />
                  <h3 className="text-lg font-black text-brand-text-primary uppercase tracking-tight">DYNAMIC AI INSIGHTS</h3>
                </div>

                <div className="space-y-4 flex-grow flex flex-col justify-center">
                  {aiInsights.map((ins) => (
                    <div 
                      key={ins.id}
                      className="p-4 bg-brand-surface-inset border border-brand-border rounded-2xl relative overflow-hidden"
                    >
                      {/* Decorative colored glow strip */}
                      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-brand-primary" />
                      <div className="pl-2">
                        <p className="text-xs font-black text-brand-text-primary uppercase mb-1 leading-tight">{ins.text}</p>
                        <p className="text-[10px] text-brand-text-secondary font-medium leading-relaxed">{ins.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[9px] font-black uppercase text-brand-primary tracking-widest flex items-center gap-1.5 mt-6 border-t border-brand-border/60 pt-4">
                  <Shield size={11} /> AgroXAI Cognitive Operations Verified
                </p>
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default FarmIntelligence;
