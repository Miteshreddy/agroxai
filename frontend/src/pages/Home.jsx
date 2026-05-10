import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Zap, ArrowRight, Shield, Sprout, CheckCircle2, Leaf, 
  MousePointer2, Play, Activity, Cpu, Thermometer, Droplets, 
  CloudRain, Wind, Globe, Sparkles, AlertTriangle, HelpCircle, 
  TrendingUp, BarChart3, Database, FileText, Lock, Compass, Eye, Sun, Snowflake
} from 'lucide-react';
import FloatingParticles from '../components/effects/FloatingParticles';
import MagneticButton from '../components/effects/MagneticButton';
import T from '../components/T';

// High-end simulated crop datasets
const SIMULATED_PRESETS = {
  Monsoon: { name: 'Super Rice Cultivar', temp: 28, humidity: 85, rain: 240, confidence: 96, soil: 'Alluvial', season: 'Kharif', color: 'from-blue-500 to-emerald-400' },
  Arid: { name: 'Hybrid Cotton Pearl', temp: 36, humidity: 24, rain: 45, confidence: 91, soil: 'Sandy', season: 'Summer', color: 'from-amber-500 to-orange-400' },
  Winter: { name: 'Premium Durum Wheat', temp: 16, humidity: 40, rain: 60, confidence: 94, soil: 'Loamy', season: 'Rabi', color: 'from-cyan-500 to-indigo-400' }
};

const ADVISORS = [
  { name: 'Dr. Evelyn Carter', role: 'Chief Agricultural Scientist', institute: 'AgriTech Labs Stanford', quote: 'The integration of XGBoost parameters with SHAP explainability marks the most significant leap forward in precision agriculture UI I have witnessed this decade.' },
  { name: 'Marcus Sterling', role: 'Partner & Chief Investment Officer', institute: 'Sovereign Green Ventures', quote: 'AgroXAI presents a world-class combination of clean, high-fidelity developer aesthetics with direct, tangible economic impact metrics for growers globally.' }
];

const Home = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth scroll transformations for parallax
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);
  const scaleY = useTransform(scrollYProgress, [0, 0.4], [1, 0.95]);

  // Dynamic Hover coordinates for cursor-ambient mesh light
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  // Handle local background mouse coordinate tracing
  const handleGlobalMouseMove = (e) => {
    const { clientX, clientY } = e;
    mouseX.set(clientX - 150);
    mouseY.set(clientY - 150);
  };

  // Hero Image Tilt States
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springTiltX = useSpring(tiltX, { stiffness: 100, damping: 25 });
  const springTiltY = useSpring(tiltY, { stiffness: 100, damping: 25 });

  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    tiltX.set(x * 0.04);
    tiltY.set(y * 0.04);
  };

  const handleHeroMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  // Environmental Config sandbox state
  const [activeClimate, setActiveClimate] = useState('Monsoon');
  const [soilNitrogen, setSoilNitrogen] = useState(70);
  const [soilPotassium, setSoilPotassium] = useState(40);
  const [isSandboxRunning, setIsSandboxRunning] = useState(false);

  // Trigger brief simulation state
  const selectClimate = (climate) => {
    setIsSandboxRunning(true);
    setActiveClimate(climate);
    if (climate === 'Monsoon') {
      setSoilNitrogen(85);
      setSoilPotassium(30);
    } else if (climate === 'Arid') {
      setSoilNitrogen(25);
      setSoilPotassium(50);
    } else {
      setSoilNitrogen(55);
      setSoilPotassium(75);
    }
    const t = setTimeout(() => setIsSandboxRunning(false), 500);
    return () => clearTimeout(t);
  };

  const activeData = SIMULATED_PRESETS[activeClimate];

  return (
    <div 
      className="bg-brand-bg min-h-screen relative overflow-hidden select-none" 
      ref={containerRef}
      onMouseMove={handleGlobalMouseMove}
    >
      <FloatingParticles />
      <div className="noise-overlay pointer-events-none" />

      {/* Cinematic Cursor-ambient glow lights */}
      <motion.div 
        style={{ left: springX, top: springY }}
        className="absolute w-[300px] h-[300px] bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none z-0 hidden md:block"
      />

      {/* Persistent global background meshes */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[55%] h-[55%] bg-brand-primary/10 rounded-full blur-[180px] animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute bottom-[10%] left-[-10%] w-[45%] h-[45%] bg-brand-gold/5 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '15s' }} />
      </div>

      {/* 1. CINEMATIC HERO SECTION */}
      <motion.section 
        style={{ y: heroY, scale: scaleY }}
        className="relative min-h-screen flex items-center pt-36 pb-20 overflow-hidden z-10"
      >
        <div className="max-w-7xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Hero Left: Large editorial content */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-2 text-brand-primary font-black text-[10px] uppercase tracking-[0.25em] bg-brand-primary/5 w-fit px-4 py-2 rounded-full border border-brand-primary/15"
            >
              <Sparkles size={11} className="animate-pulse text-brand-primary" />
              <T>Next-Gen Agricultural Intelligence</T>
            </motion.div>

            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, filter: 'blur(10px)', y: 40 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl md:text-8xl font-black text-brand-text-primary leading-[1.0] tracking-tight uppercase"
              >
                <T>Cultivate with</T>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-emerald-400 to-brand-gold animate-gradient-x">
                  <T>Absolute Certainty</T>
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.15 }}
                className="text-lg text-brand-text-secondary font-medium max-w-xl leading-relaxed"
              >
                <T>Translate multi-spectral soil datasets, climatic histories, and target coordinate vectors into high-yield predictions backed by explainable SHAP neural maps.</T>
              </motion.p>
            </div>

            {/* Premium CTA Mechanics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="flex flex-wrap items-center gap-6"
            >
              <MagneticButton>
                <Link to="/recommend" className="btn-primary group h-14 px-8 flex items-center justify-center rounded-2xl relative overflow-hidden shadow-premium hover:shadow-premium-hover">
                  <span className="relative z-10 flex items-center gap-2">
                    <T>Run Advanced Analysis</T>
                    <ArrowRight className="inline transition-transform group-hover:translate-x-1" size={16} />
                  </span>
                </Link>
              </MagneticButton>

              <MagneticButton>
                <Link to="/my-farm" className="h-14 px-8 bg-brand-surface border border-brand-border hover:border-brand-primary/30 text-brand-text-primary hover:text-brand-primary font-bold rounded-2xl flex items-center justify-center transition-all shadow-sm">
                  <T>Configure Farm</T>
                </Link>
              </MagneticButton>
            </motion.div>

            {/* Live stats feed */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-brand-border/60 max-w-md"
            >
              <div>
                <p className="text-2xl font-black text-brand-text-primary">94.8%</p>
                <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-wider">Model Accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-black text-brand-text-primary">0.02s</p>
                <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-wider">Inference Speed</p>
              </div>
              <div>
                <p className="text-2xl font-black text-brand-text-primary">100%</p>
                <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-wider">SHAP Transparency</p>
              </div>
            </motion.div>
          </div>

          {/* Hero Right: Layered Cinematic composition with Generated Asset */}
          <div className="lg:col-span-6 relative w-full h-[620px] flex items-center justify-center">
            
            {/* Ambient Background Aura specifically behind the card */}
            <div className="absolute w-80 h-80 bg-brand-primary/20 rounded-full blur-[80px] pointer-events-none z-0" />

            <motion.div
              style={{ x: springTiltX, y: springTiltY }}
              onMouseMove={handleHeroMouseMove}
              onMouseLeave={handleHeroMouseLeave}
              className="relative w-full max-w-[480px] h-[550px] rounded-[2.5rem] bg-brand-surface border border-brand-border/80 shadow-premium p-6 overflow-hidden z-10 hover:border-brand-primary/30 transition-colors duration-500 group"
            >
              {/* Luxury Cinematic Agriculture Image (Generated Asset) */}
              <div className="relative w-full h-[240px] rounded-2xl overflow-hidden border border-brand-border mb-6">
                <img 
                  src="/images/smart_drone_farming.png" 
                  alt="Cinematic Smart Farming"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/90 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-brand-bg/60 backdrop-blur-md border border-brand-border px-3 py-1.5 rounded-xl">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping" />
                  <p className="text-[9px] font-black text-brand-text-primary uppercase tracking-wider">Drone telemetry map active</p>
                </div>
              </div>

              {/* Data Overlay Cards row */}
              <div className="space-y-4 relative z-20">
                <div className="p-4 bg-brand-surface-inset border border-brand-border rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                      <Cpu size={18} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-brand-text-secondary uppercase tracking-widest">Active Predictive Model</p>
                      <p className="text-xs font-black text-brand-text-primary uppercase">XGBoost Multiclass classifier</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-brand-primary/10 text-brand-primary text-[8px] font-black uppercase rounded-md tracking-wider">V2.4</span>
                  </div>
                </div>

                {/* Simulated weather indicators */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-brand-surface-inset border border-brand-border rounded-xl flex flex-col justify-between">
                    <p className="text-[8px] font-black text-brand-text-secondary uppercase tracking-widest mb-1">Soil Temperature</p>
                    <div className="flex items-center gap-2">
                      <Thermometer size={14} className="text-brand-primary" />
                      <p className="text-sm font-black text-brand-text-primary">27.4 °C</p>
                    </div>
                  </div>
                  <div className="p-4 bg-brand-surface-inset border border-brand-border rounded-xl flex flex-col justify-between">
                    <p className="text-[8px] font-black text-brand-text-secondary uppercase tracking-widest mb-1">Air Humidity</p>
                    <div className="flex items-center gap-2">
                      <Droplets size={14} className="text-blue-400" />
                      <p className="text-sm font-black text-brand-text-primary">82%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions to Hover */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-[8px] font-black text-brand-primary uppercase tracking-widest flex items-center gap-1.5">
                  <MousePointer2 size={10} /> Tilt to Inspect Parameters
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </motion.section>

      {/* 2. EXPLAINABLE AI MODEL PIPELINE SHOWCASE */}
      <section className="py-24 relative z-10 border-t border-brand-border/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="badge-ai mb-4"><Cpu size={10} /><T>TRANSPARENCY CORE</T></span>
            <h2 className="text-4xl md:text-5xl font-black text-brand-text-primary uppercase tracking-tight mb-4">
              <T>OUR MODEL IS A OPEN BOOK</T>
            </h2>
            <p className="text-brand-text-secondary font-medium">
              <T>We utilize SHAP (SHapley Additive exPlanations) values to break down exactly how much every feature shifts the predictive vector.</T>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Schematic flow */}
            <div className="lg:col-span-6 bg-brand-surface-inset border border-brand-border rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col justify-between h-[500px]">
              <div className="absolute top-0 right-0 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl -mr-20 -mt-20" />
              
              <div>
                <h3 className="text-lg font-black text-brand-text-primary uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Activity size={18} className="text-brand-primary animate-pulse" /> Neural Pipeline Sequence
                </h3>
                <p className="text-brand-text-secondary text-xs font-medium max-w-md">
                  Observe how input elements flow through our trained tree structure to arrive at the final recommendation result.
                </p>
              </div>

              {/* Pipeline schematic vector nodes */}
              <div className="space-y-6 relative z-10 my-8">
                {[
                  { label: 'Variables (N-P-K + pH + Climate)', status: 'Captured', color: 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary' },
                  { label: 'XGBoost Multi-classification Node', status: 'Processing', color: 'bg-brand-gold/10 border-brand-gold/30 text-brand-gold' },
                  { label: 'SHAP Value Weights Analysis', status: 'Generating', color: 'bg-blue-400/10 border-blue-400/30 text-blue-400' }
                ].map((node, i) => (
                  <motion.div 
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-center justify-between p-4 bg-brand-surface border border-brand-border rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-brand-border flex items-center justify-center text-[10px] font-black text-brand-text-primary">
                        {i + 1}
                      </div>
                      <p className="text-xs font-black text-brand-text-primary uppercase">{node.label}</p>
                    </div>
                    <span className={`px-2.5 py-1 text-[8px] font-black uppercase rounded-lg border ${node.color}`}>
                      {node.status}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 bg-brand-surface rounded-2xl border border-brand-border">
                <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest text-center">
                  Predictive parameters synchronized securely to local system databases.
                </p>
              </div>
            </div>

            {/* Explanation readout and charts mockup */}
            <div className="lg:col-span-6 space-y-6">
              <div className="premium-card !p-8">
                <h3 className="text-sm font-black text-brand-text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
                  <TrendingUp size={16} className="text-brand-primary" /> Core Feature Importance Ratings
                </h3>

                <div className="space-y-5">
                  {[
                    { label: 'Rainfall Density Estimation', pct: 88, color: 'bg-brand-primary' },
                    { label: 'Potassium Soil Composition', pct: 74, color: 'bg-brand-primary/80' },
                    { label: 'Ambient Regional Temperature', pct: 62, color: 'bg-brand-gold' },
                    { label: 'Soil Acid Parameters (pH)', pct: 45, color: 'bg-blue-400' }
                  ].map((feat, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-wider mb-2">
                        <span className="text-brand-text-primary">{feat.label}</span>
                        <span className="text-brand-text-secondary">{feat.pct}% weight</span>
                      </div>
                      <div className="w-full h-2 bg-brand-border rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${feat.pct}%` }}
                          transition={{ duration: 1.2, delay: i * 0.1 }}
                          className={`h-full rounded-full ${feat.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-brand-surface-inset border border-brand-border rounded-[2rem] flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center shrink-0 text-brand-primary">
                  <Shield size={22} />
                </div>
                <div>
                  <p className="text-xs font-black text-brand-text-primary uppercase">Risk Analysis Warnings</p>
                  <p className="text-brand-text-secondary text-xs font-medium leading-relaxed mt-1">
                    Automatic predictions analyze climatic patterns to warn users of high risk levels (Poor Yield probability) during extreme precipitation variables.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE GEOSPATIAL MAP & WEATHER SIMULATOR */}
      <section className="py-24 relative z-10 border-t border-brand-border/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="badge-ai mb-4"><Compass size={10} /><T>ENVIRONMENTAL TELEMETRY</T></span>
            <h2 className="text-4xl md:text-5xl font-black text-brand-text-primary uppercase tracking-tight mb-4">
              <T>GEOSPATIAL SANDBOX SIMULATOR</T>
            </h2>
            <p className="text-brand-text-secondary font-medium">
              <T>Select simulated climates below to observe how coordinate models adjust prediction variables instantly to target regions.</T>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left: Simulated satellite image map with generated asset */}
            <div className="lg:col-span-7 bg-brand-surface-inset border border-brand-border rounded-[2.5rem] p-6 relative overflow-hidden flex flex-col justify-between min-h-[500px]">
              <div className="absolute inset-0 z-0">
                <img 
                  src="/images/agri_satellite_intel.png" 
                  alt="Geospatial Map Analytics"
                  className="w-full h-full object-cover opacity-60"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/40 to-transparent" />
              </div>

              <div className="relative z-10 flex justify-between items-start">
                <div className="p-3 bg-brand-bg/80 backdrop-blur-md border border-brand-border rounded-xl">
                  <p className="text-[8px] font-black text-brand-text-secondary uppercase tracking-widest">Active Coordinate</p>
                  <p className="text-xs font-black text-brand-text-primary uppercase">LAT: 26.9124 · LON: 70.9120</p>
                </div>
                <div className="flex items-center gap-1 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider">
                  <Globe size={11} className="animate-spin" style={{ animationDuration: '20s' }} /> Multi-Spectral Active
                </div>
              </div>

              {/* Dynamic simulated values readout based on active climate */}
              <div className="relative z-10 grid grid-cols-3 gap-3">
                <div className="p-3 bg-brand-bg/80 backdrop-blur-md border border-brand-border rounded-xl">
                  <p className="text-[8px] font-black text-brand-text-secondary uppercase mb-1">Temperature</p>
                  <p className="text-sm font-black text-brand-text-primary">{activeData.temp} °C</p>
                </div>
                <div className="p-3 bg-brand-bg/80 backdrop-blur-md border border-brand-border rounded-xl">
                  <p className="text-[8px] font-black text-brand-text-secondary uppercase mb-1">Air Humidity</p>
                  <p className="text-sm font-black text-brand-text-primary">{activeData.humidity}%</p>
                </div>
                <div className="p-3 bg-brand-bg/80 backdrop-blur-md border border-brand-border rounded-xl">
                  <p className="text-[8px] font-black text-brand-text-secondary uppercase mb-1">Est. Rainfall</p>
                  <p className="text-sm font-black text-brand-text-primary">{activeData.rain} mm</p>
                </div>
              </div>
            </div>

            {/* Right: Sandbox Controls & Output */}
            <div className="lg:col-span-5 bg-brand-surface-inset border border-brand-border rounded-[2.5rem] p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-black text-brand-text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Zap size={18} className="text-brand-primary" /> Climate Matrix controls
                </h3>

                {/* Climatic selection buttons */}
                <div className="grid grid-cols-3 gap-2 mb-8">
                  {[
                    { key: 'Monsoon', icon: CloudRain, label: 'Monsoon' },
                    { key: 'Arid', icon: Sun, label: 'Arid' },
                    { key: 'Winter', icon: Snowflake, label: 'Winter' }
                  ].map(climate => (
                    <button
                      key={climate.key}
                      onClick={() => selectClimate(climate.key)}
                      className={`p-3 rounded-xl border font-black uppercase text-[10px] tracking-wider flex flex-col items-center gap-2 transition-all ${
                        activeClimate === climate.key 
                          ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary shadow-sm' 
                          : 'bg-brand-surface border-brand-border text-brand-text-secondary hover:text-brand-primary hover:border-brand-primary/15'
                      }`}
                    >
                      <climate.icon size={16} />
                      {climate.label}
                    </button>
                  ))}
                </div>

                {/* Soil Nitrogen & Potassium display */}
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-wider mb-2">
                      <span className="text-brand-text-primary">Simulated Nitrogen (N)</span>
                      <span className="text-brand-primary">{soilNitrogen} mg/kg</span>
                    </div>
                    <div className="w-full h-1 bg-brand-border rounded-full overflow-hidden">
                      <motion.div animate={{ width: `${(soilNitrogen / 120) * 100}%` }} className="h-full bg-brand-primary" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-wider mb-2">
                      <span className="text-brand-text-primary">Simulated Potassium (K)</span>
                      <span className="text-brand-primary">{soilPotassium} mg/kg</span>
                    </div>
                    <div className="w-full h-1 bg-brand-border rounded-full overflow-hidden">
                      <motion.div animate={{ width: `${(soilPotassium / 120) * 100}%` }} className="h-full bg-brand-primary" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Simulation Result container */}
              <div className="p-6 bg-brand-surface border border-brand-border rounded-2xl relative overflow-hidden">
                <p className="text-[8px] font-black text-brand-text-secondary uppercase tracking-widest mb-1">Target Crop Match</p>
                <AnimatePresence mode="wait">
                  {isSandboxRunning ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-10 flex items-center"
                    >
                      <span className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key={activeData.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <h4 className="text-2xl font-black text-brand-text-primary uppercase tracking-tight mb-2">
                        {activeData.name}
                      </h4>
                      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider pt-2 border-t border-brand-border/60">
                        <span className="text-brand-text-secondary">Accuracy Score</span>
                        <span className="text-brand-primary">{activeData.confidence}% Confidence</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. ELITE ASYMMETRIC BENTO GRID */}
      <section className="py-24 relative z-10 border-t border-brand-border/60 bg-brand-surface-inset/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="badge-ai mb-4"><Database size={10} /><T>CAPABILITIES OVERVIEW</T></span>
            <h2 className="text-4xl md:text-5xl font-black text-brand-text-primary uppercase tracking-tight mb-4">
              <T>ENGINEERED BENTO GRID CAPABILITIES</T>
            </h2>
            <p className="text-brand-text-secondary font-medium">
              <T>Explore custom modules mapped dynamically to deliver state-of-the-art agricultural decisions.</T>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Bento 1: Smart drone targets (using generated image) */}
            <div className="bg-brand-surface border border-brand-border rounded-[2.5rem] p-6 col-span-1 md:col-span-2 min-h-[380px] flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute inset-0 z-0">
                <img 
                  src="/images/smart_drone_farming.png" 
                  alt="Drone Targeting"
                  className="w-full h-full object-cover opacity-15 group-hover:scale-105 transition-transform duration-[1.5s]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-brand-surface/60 to-transparent" />
              </div>

              <div className="relative z-10 flex justify-between items-start">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
                  <Sprout size={22} />
                </div>
                <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-[8px] font-black uppercase rounded-lg tracking-wider border border-brand-primary/20">Active</span>
              </div>

              <div className="relative z-10 max-w-md">
                <h3 className="text-xl font-black text-brand-text-primary uppercase mb-2">Automated Field Scanner Target</h3>
                <p className="text-brand-text-secondary text-xs leading-relaxed font-medium">
                  Matches crop inputs dynamically against coordinate indexes to evaluate chlorophyll ratios and health markers instantly via satellite datasets.
                </p>
              </div>
            </div>

            {/* Bento 2: Regional pH indexer */}
            <div className="bg-brand-surface border border-brand-border rounded-[2.5rem] p-8 flex flex-col justify-between min-h-[380px] group">
              <div className="w-12 h-12 bg-brand-gold/10 rounded-2xl flex items-center justify-center text-brand-gold group-hover:rotate-12 transition-transform">
                <Compass size={22} />
              </div>
              
              <div>
                <h3 className="text-xl font-black text-brand-text-primary uppercase mb-2">Climatic pH Scales</h3>
                <p className="text-brand-text-secondary text-xs leading-relaxed font-medium mb-4">
                  Evaluates exact local soil alkalinity markers to prevent critical crop matching mismatches before financial cycles begin.
                </p>
                <div className="flex items-center gap-2 bg-brand-surface-inset border border-brand-border p-3 rounded-xl">
                  <Activity size={12} className="text-brand-gold" />
                  <span className="text-[10px] font-black text-brand-text-primary uppercase">Current Match: 6.8 (Optimal)</span>
                </div>
              </div>
            </div>

            {/* Bento 3: Data Analytics mock */}
            <div className="bg-brand-surface border border-brand-border rounded-[2.5rem] p-8 flex flex-col justify-between min-h-[380px] group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                <BarChart3 size={22} />
              </div>

              <div>
                <h3 className="text-xl font-black text-brand-text-primary uppercase mb-2">Historical Records</h3>
                <p className="text-brand-text-secondary text-xs leading-relaxed font-medium">
                  Saves prediction datasets seamlessly to securely encrypt log sequences directly to user dashboard history panels.
                </p>
              </div>
            </div>

            {/* Bento 4: Financial projections layout with asset */}
            <div className="bg-brand-surface border border-brand-border rounded-[2.5rem] p-6 col-span-1 md:col-span-2 min-h-[380px] flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute inset-0 z-0">
                <img 
                  src="/images/agri_analytics_ui.png" 
                  alt="Analytics Dashboard preview"
                  className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-[1.5s]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-brand-surface/40 to-transparent" />
              </div>

              <div className="relative z-10 flex justify-between items-start">
                <div className="w-12 h-12 bg-emerald-400/10 rounded-2xl flex items-center justify-center text-emerald-400">
                  <TrendingUp size={22} />
                </div>
              </div>

              <div className="relative z-10 max-w-md">
                <h3 className="text-xl font-black text-brand-text-primary uppercase mb-2">Revenue Cost Calculators</h3>
                <p className="text-brand-text-secondary text-xs leading-relaxed font-medium">
                  Calculates crop yield density averages against historical regional pricing indices to display target revenue scales and expenses before you sow.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. LIVE ANALYTICS PREVIEW SECTION */}
      <section className="py-24 relative z-10 border-t border-brand-border/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column: Glass Browser Frame with Generated UI screenshot */}
            <div className="lg:col-span-7 relative flex items-center justify-center">
              <div className="absolute w-72 h-72 bg-brand-primary/10 rounded-full blur-[80px] pointer-events-none z-0" />
              
              <div className="relative w-full rounded-2xl border border-brand-border bg-brand-surface shadow-premium overflow-hidden z-10">
                {/* Simulated window header bar */}
                <div className="flex items-center justify-between px-6 py-4 bg-brand-surface-inset border-b border-brand-border">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <span className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">agro_analytics_dashboard_v2_mock</span>
                  <div className="w-6" />
                </div>

                <div className="p-4 bg-brand-surface-inset">
                  <img 
                    src="/images/agri_analytics_ui.png" 
                    alt="Analytics Dashboard UI" 
                    className="w-full rounded-xl border border-brand-border"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Explanatory SaaS analytics text */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
              <span className="badge-ai w-fit"><Activity size={10} /><T>DEVELOPER COCKPIT</T></span>
              <h2 className="text-4xl md:text-5xl font-black text-brand-text-primary uppercase tracking-tight leading-none">
                <T>DECISION TELEMETRY CONSOLE</T>
              </h2>
              <p className="text-brand-text-secondary font-medium leading-relaxed">
                <T>Our real-time analytics interface bridges advanced soil telemetry datasets directly to actionable growth planners. Export full matching guides, timeline parameters, and nitrogen status tables in one click.</T>
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-brand-primary shrink-0" />
                  <p className="text-xs font-black text-brand-text-primary uppercase">PDF Crop Intelligence Exporter</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-brand-primary shrink-0" />
                  <p className="text-xs font-black text-brand-text-primary uppercase">Government Scheme matching algorithms</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-brand-primary shrink-0" />
                  <p className="text-xs font-black text-brand-text-primary uppercase">Comprehensive Labour scheduling guides</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. IMMERSIVE ADVISORS REVIEWS */}
      <section className="py-24 relative z-10 border-t border-brand-border/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="badge-ai mb-4"><Shield size={10} /><T>PARTNER CREDIBILITY</T></span>
            <h2 className="text-4xl md:text-5xl font-black text-brand-text-primary uppercase tracking-tight mb-4">
              <T>TRUSTED BY PRESTIGIOUS AGENTS</T>
            </h2>
            <p className="text-brand-text-secondary font-medium">
              <T>Validated by leading agricultural research boards and specialized VC panels.</T>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ADVISORS.map((adv, i) => (
              <div 
                key={i}
                className="bg-brand-surface border border-brand-border rounded-[2.5rem] p-8 flex flex-col justify-between min-h-[260px] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl" />
                <p className="text-brand-text-secondary text-sm leading-relaxed font-medium italic relative z-10 mb-6">
                  "{adv.quote}"
                </p>
                <div className="flex items-center gap-3 border-t border-brand-border/60 pt-4">
                  <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center font-black text-sm">
                    {adv.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-black text-brand-text-primary uppercase">{adv.name}</p>
                    <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest">{adv.role} · {adv.institute}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. LAUNCH CALL TO ACTION CARD */}
      <section className="py-24 relative z-10 border-t border-brand-border/60 bg-gradient-to-b from-transparent to-brand-primary/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative p-12 md:p-16 rounded-[3.5rem] bg-brand-surface border border-brand-border/80 shadow-premium overflow-hidden text-center">
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
            <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-80 h-80 bg-brand-primary/15 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
              <span className="badge-ai mx-auto"><Activity size={10} /><T>INITIALIZE FARM MAPS</T></span>
              <h2 className="text-4xl md:text-6xl font-black text-brand-text-primary uppercase tracking-tight leading-none">
                <T>READY TO OPTIMIZE YOUR FIELD?</T>
              </h2>
              <p className="text-brand-text-secondary font-medium text-base">
                <T>Connect with our trained model datasets, compute exact feature explanations, and access crop recommendations instantly.</T>
              </p>

              <div className="flex flex-wrap justify-center items-center gap-4">
                <MagneticButton>
                  <Link to="/recommend" className="btn-primary group h-14 px-8 flex items-center justify-center rounded-2xl relative overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2">
                      <T>Get Best Crop Match</T>
                      <ArrowRight className="inline transition-transform group-hover:translate-x-1" size={16} />
                    </span>
                  </Link>
                </MagneticButton>

                <MagneticButton>
                  <Link to="/recommend?demo=true" className="h-14 px-8 bg-brand-surface border border-brand-border hover:border-brand-primary/30 text-brand-text-primary hover:text-brand-primary font-bold rounded-2xl flex items-center justify-center transition-all">
                    <T>Try Sandbox Demo</T>
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. COMPLETE PREMIUM FOOTER REDESIGN */}
      <footer className="relative border-t border-brand-border bg-brand-surface z-10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            {/* Col 1: Brand details */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-premium">
                  <Leaf className="text-white" size={20} />
                </div>
                <span className="text-xl font-black tracking-tighter text-brand-text-primary uppercase">
                  Agro<span className="text-brand-primary italic">XAI</span>
                </span>
              </Link>
              <p className="text-brand-text-secondary text-xs leading-relaxed max-w-xs font-medium">
                SaaS-grade decision mapping models translating soil diagnostics, humidity values, and coordinates into reliable cultivation roadmaps.
              </p>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-brand-text-primary uppercase tracking-[0.25em]">Precision Paths</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-xs text-brand-text-secondary hover:text-brand-primary font-bold transition-all"><T>Home Interface</T></Link></li>
                <li><Link to="/recommend" className="text-xs text-brand-text-secondary hover:text-brand-primary font-bold transition-all"><T>Analyze Soil</T></Link></li>
                <li><Link to="/my-farm" className="text-xs text-brand-text-secondary hover:text-brand-primary font-bold transition-all"><T>Farm Dashboard</T></Link></li>
                <li><Link to="/history" className="text-xs text-brand-text-secondary hover:text-brand-primary font-bold transition-all"><T>Analytics History</T></Link></li>
              </ul>
            </div>

            {/* Col 3: ML Technology stack details */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-brand-text-primary uppercase tracking-[0.25em]">ML Tech Stack</h4>
              <ul className="space-y-2 text-xs text-brand-text-secondary font-bold uppercase tracking-wider">
                <li>XGBoost Classifier Models</li>
                <li>SHAP value weights analysis</li>
                <li>Vite React Engine</li>
                <li>Atlas MongoDB Layers</li>
              </ul>
            </div>

            {/* Col 4: TLS Protection & Verification details */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-brand-text-primary uppercase tracking-[0.25em]">Platform Security</h4>
              <p className="text-brand-text-secondary text-xs leading-relaxed font-medium">
                Complete SSL TLS data encryption ensuring local database logs remain secure.
              </p>
              <div className="flex items-center gap-1.5 text-brand-primary font-black text-[9px] uppercase tracking-wider bg-brand-primary/5 px-3 py-1.5 rounded-lg border border-brand-primary/10 w-fit">
                <Shield size={10} /> TLS 1.3 Verified Protection
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">
              © {new Date().getFullYear()} AGROXAI CORP. ALL RIGHTS RESERVED.
            </p>
            <div className="flex items-center gap-6 text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">
              <span className="hover:text-brand-primary cursor-pointer transition-all">Privacy Policy</span>
              <span className="hover:text-brand-primary cursor-pointer transition-all">Terms of Use</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default Home;
