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

const SHAP_FEATURES = [
  { name: 'Nitrogen Ratio (N)', weight: 35, impact: 'Positive', detail: 'Primary driver for vegetative volume and dense foliage growth parameters.' },
  { name: 'Soil alkalinity (pH)', weight: -28, impact: 'Negative', detail: 'High local values limit micronutrient uptake thresholds.' },
  { name: 'Rainfall volume', weight: 22, impact: 'Positive', detail: 'Critical moisture triggers in Kharif matching algorithms.' },
  { name: 'Regional temperature', weight: 15, impact: 'Positive', detail: 'Supports optimal enzymatic activity and transpiration speeds.' }
];

const Home = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth scroll transformations for immersive cinematic storytelling
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.9]);

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



  // Environmental Config sandbox state
  const [activeClimate, setActiveClimate] = useState('Monsoon');
  const [soilNitrogen, setSoilNitrogen] = useState(70);
  const [soilPotassium, setSoilPotassium] = useState(40);
  const [isSandboxRunning, setIsSandboxRunning] = useState(false);

  // SHAP visualization active node index hover
  const [activeSHAPIndex, setActiveSHAPIndex] = useState(0);

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

      {/* 1. THE VOLUMETRIC CENTER-STAGE HERO (The Opening Frame) */}
      <section className="min-h-screen flex flex-col justify-center items-center relative z-10 px-6 pt-32 pb-16 overflow-hidden">
        
        {/* ========================================================
            CINEMATIC LAYERED BACKGROUND SYSTEM (ATMOSPHERIC DEPTH)
            ======================================================== */}
        
        {/* 1. Large blurred emerald/cyan AI glow / aurora orb */}
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-brand-primary/15 via-emerald-400/8 to-cyan-400/4 rounded-full blur-[110px] pointer-events-none z-0 mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />

        {/* 2. Subtle animated particle system */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`hero-p-${i}`}
              initial={{ 
                x: `${Math.random() * 100}%`, 
                y: `${Math.random() * 100}%`, 
                opacity: Math.random() * 0.25 + 0.05, 
                scale: Math.random() * 0.4 + 0.4 
              }}
              animate={{
                y: ['105%', '-5%'],
                opacity: [0, 0.35, 0]
              }}
              transition={{
                duration: Math.random() * 15 + 15,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute w-1.5 h-1.5 bg-brand-primary rounded-full blur-[0.5px]"
            />
          ))}
        </div>

        {/* 3. Environmental/topographic contour lines */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-[0.035] pointer-events-none z-0 flex items-center justify-center mix-blend-overlay"
        >
          <svg viewBox="0 0 1000 1000" className="w-[140%] h-[140%] opacity-80 select-none pointer-events-none">
            <circle cx="500" cy="500" r="100" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="500" cy="500" r="200" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="500" cy="500" r="300" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 5" />
            <circle cx="500" cy="500" r="400" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="500" cy="500" r="500" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 6" />
            <path d="M100,500 C 200,450 300,550 500,500 C 700,450 800,550 900,500" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M100,300 C 300,220 400,380 500,300 C 650,220 700,380 900,300" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <path d="M100,700 C 250,620 350,780 500,700 C 600,620 750,780 900,700" fill="none" stroke="currentColor" strokeWidth="0.8" />
          </svg>
        </motion.div>

        {/* 4. Futuristic AI analytics HUD fragments */}
        <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center p-6">
          <div className="w-full h-full max-w-5xl relative">
            <div className="absolute top-20 -left-1 w-5 h-5 border-t border-l border-brand-primary/20" />
            <div className="absolute top-20 -right-1 w-5 h-5 border-t border-r border-brand-primary/20" />
            <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b border-l border-brand-primary/20" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b border-r border-brand-primary/20" />
            
            <div className="absolute top-28 left-8 text-[8px] font-black text-brand-primary/20 tracking-[0.25em] uppercase select-none">GRID_INTEL // COORD_ALPHA_9</div>
            <div className="absolute bottom-8 right-8 text-[8px] font-black text-brand-primary/20 tracking-[0.25em] uppercase select-none">LAT_78.48 // LNG_17.38</div>
          </div>
        </div>

        {/* 5. Very low-opacity farming aerial imagery */}
        <div className="absolute inset-0 pointer-events-none z-0 mix-blend-overlay opacity-[0.025]">
          <div className="w-full h-full bg-[url('/images/agri_satellite_intel.png')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-bg via-transparent to-brand-bg" />
        </div>

        {/* 6. Cinematic volumetric lighting/fog */}
        <motion.div 
          animate={{
            x: [-15, 15, -15],
            y: [-8, 8, -8],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 w-[115%] h-[115%] bg-gradient-to-tr from-brand-primary/0 via-brand-primary/[0.02] to-cyan-400/0 blur-[90px] pointer-events-none z-0"
        />

        {/* 7. Mouse-reactive gradient mesh movement */}
        <motion.div 
          style={{ 
            x: springX, 
            y: springY,
            transform: 'translate(-50%, -50%)'
          }}
          className="absolute w-[450px] h-[450px] bg-gradient-to-tr from-brand-primary/4 to-cyan-500/3 rounded-full blur-[140px] pointer-events-none z-0 mix-blend-screen hidden md:block"
        />

        {/* 8. Thin animated neural-network connection lines */}
        <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.12]">
          <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none">
            <motion.path 
              d="M 150,250 Q 350,150 600,450 T 1050,550" 
              stroke="var(--accent-primary)" 
              strokeWidth="0.5" 
              strokeDasharray="4 12" 
              className="animate-flow"
              style={{ animationDuration: '40s' }}
            />
            <motion.path 
              d="M 200,550 Q 550,350 850,250 T 1000,200" 
              stroke="var(--accent-primary)" 
              strokeWidth="0.5" 
              strokeDasharray="3 15" 
              className="animate-flow"
              style={{ animationDuration: '30s' }}
            />
          </svg>
        </div>

        {/* 9. Soft floating data indicators */}
        <div className="absolute inset-0 pointer-events-none z-0 hidden lg:block select-none">
          <motion.div 
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[28%] left-[8%] bg-brand-surface/20 border border-brand-border/40 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-[8px] font-black text-brand-text-secondary tracking-[0.2em] uppercase flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping" />
            SATELLITE_LINK_STABLE
          </motion.div>

          <motion.div 
            animate={{ y: [8, -8, 8] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[28%] right-[8%] bg-brand-surface/20 border border-brand-border/40 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-[8px] font-black text-brand-text-secondary tracking-[0.2em] uppercase flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            XGB_REASON_CORE
          </motion.div>
        </div>

        {/* 10. Ambient motion depth (Framer Motion container wrapper) */}
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="text-center max-w-5xl mx-auto space-y-8 flex flex-col items-center relative z-10"
        >
          {/* Futuristic Micro-badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-brand-primary/20"
          >
            <Sparkles size={11} className="animate-spin" style={{ animationDuration: '4s' }} />
            <T>PRECISION AGRICULTURAL INTELLIGENCE ENGINE</T>
          </motion.div>

          {/* Editorial Revealing Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-brand-text-primary tracking-tighter leading-[0.85] uppercase max-w-4xl"
          >
            <T>CULTIVATE WITH</T> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-emerald-400 to-brand-gold italic">REASON</span>
          </motion.h1>

          {/* Handcrafted, Art-Directed Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-brand-text-secondary font-medium text-base md:text-lg max-w-2xl leading-relaxed"
          >
            <T>Translating soil parameters, local climatic patterns, and coordinate indices into reliable, crop-yield predictions via explainable machine learning pipelines.</T>
          </motion.p>

          {/* Cinematic Interactive Call-To-Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <MagneticButton>
              <Link 
                to="/recommend" 
                className="btn-primary px-8 py-4 bg-brand-primary text-slate-950 font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl flex items-center gap-2 border border-brand-primary/20 shadow-premium hover:shadow-premium-hover hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <T>GET BEST CROP MATCH</T>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </MagneticButton>

            <MagneticButton>
              <a 
                href="#sandbox" 
                className="px-8 py-4 bg-brand-surface border border-brand-border hover:border-brand-primary/30 text-brand-text-primary hover:text-brand-primary font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl transition-all shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <Play size={10} className="fill-current" />
                <T>AGROXAI DEMO</T>
              </a>
            </MagneticButton>
          </motion.div>

          {/* Holographic Centerpiece Floating Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl mx-auto mt-16 px-4 relative z-10"
          >
            {/* Subtle atmospheric glow behind the dashboard */}
            <div className="absolute inset-x-12 -top-6 bottom-6 bg-brand-primary/5 rounded-full blur-[60px] pointer-events-none" />

            <motion.div
              whileHover={{ y: -6, rotateX: 1, rotateY: -1 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="w-full bg-brand-surface/30 border border-brand-border/40 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 shadow-premium relative overflow-hidden text-left"
            >
              {/* Glossy highlight reflect lines */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />

              {/* Dashboard grid header bar */}
              <div className="flex items-center justify-between border-b border-brand-border/40 pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-primary/40" />
                  </div>
                  <div className="h-4 w-[1px] bg-brand-border/60 mx-1" />
                  <span className="text-[9px] font-black tracking-[0.25em] text-brand-text-secondary uppercase flex items-center gap-1.5">
                    <Cpu size={12} className="text-brand-primary animate-pulse" />
                    AGROXAI_CORE_OS_v3.8
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-ping" />
                  <span className="text-[9px] font-black tracking-[0.15em] text-brand-primary uppercase">
                    <T>COGNITIVE_GRID_ACTIVE</T>
                  </span>
                </div>
              </div>

              {/* Content segments */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                
                {/* Box 1 (4/12): Live Radar Scanning metrics */}
                <div className="md:col-span-4 bg-brand-surface-inset border border-brand-border/40 rounded-3xl p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-brand-text-secondary uppercase tracking-widest">
                      <T>DIAGNOSTIC TELEMETRY</T>
                    </span>
                    <h4 className="text-xs font-black text-brand-text-primary uppercase tracking-tight">
                      <T>ENVIRONMENTAL SENSORS</T>
                    </h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-brand-border/30 pb-2">
                      <span className="text-[9px] font-black text-brand-text-secondary uppercase flex items-center gap-1.5">
                        <Thermometer size={11} className="text-brand-primary" /> <T>TEMP</T>
                      </span>
                      <span className="text-[10px] font-black text-brand-text-primary">24.8°C</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-brand-border/30 pb-2">
                      <span className="text-[9px] font-black text-brand-text-secondary uppercase flex items-center gap-1.5">
                        <Droplets size={11} className="text-brand-primary" /> <T>HUMIDITY</T>
                      </span>
                      <span className="text-[10px] font-black text-brand-text-primary">78.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-brand-text-secondary uppercase flex items-center gap-1.5">
                        <CloudRain size={11} className="text-brand-primary" /> <T>PRECIPITATION</T>
                      </span>
                      <span className="text-[10px] font-black text-brand-text-primary">212 mm</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center justify-between text-[8px] font-black text-brand-text-secondary mb-1">
                      <span><T>PREDICTIVE STABILITY</T></span>
                      <span className="text-brand-primary">98.4%</span>
                    </div>
                    <div className="w-full h-1 bg-brand-border/60 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "98.4%" }}
                        transition={{ duration: 1.5, delay: 0.8 }}
                        className="h-full bg-gradient-to-r from-brand-primary to-emerald-400" 
                      />
                    </div>
                  </div>
                </div>

                {/* Box 2 (5/12): Crop growth pattern mini-chart */}
                <div className="md:col-span-5 bg-brand-surface-inset border border-brand-border/40 rounded-3xl p-5 flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[8px] font-black text-brand-text-secondary uppercase tracking-widest">
                        <T>ANALYTICS STREAM</T>
                      </span>
                      <h4 className="text-xs font-black text-brand-text-primary uppercase tracking-tight">
                        <T>CROP HEALTH DYNAMICS</T>
                      </h4>
                    </div>
                    <span className="text-[8px] font-black px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded-md uppercase border border-brand-primary/20">
                      <T>REAL_TIME</T>
                    </span>
                  </div>

                  {/* Minimal dynamic sparkline SVG graph */}
                  <div className="h-20 w-full flex items-end">
                    <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, delay: 1, ease: "easeOut" }}
                        d="M 0,35 Q 20,10 40,25 T 80,12 T 100,5"
                        fill="none"
                        stroke="var(--accent-primary)"
                        strokeWidth="1.5"
                      />
                      <motion.path
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 2 }}
                        d="M 0,35 Q 20,10 40,25 T 80,12 T 100,5 L 100,40 L 0,40 Z"
                        fill="url(#glowGrad)"
                      />
                    </svg>
                  </div>

                  <div className="flex justify-between items-center pt-2 text-[8px] font-black text-brand-text-secondary uppercase tracking-wider">
                    <span>YIELD COEFF: +14.2%</span>
                    <span className="text-brand-primary">
                      <T>OPTIMAL ALIGNMENT</T>
                    </span>
                  </div>
                </div>

                {/* Box 3 (3/12): Decision Confidence Ring */}
                <div className="md:col-span-3 bg-brand-surface-inset border border-brand-border/40 rounded-3xl p-5 flex flex-col justify-between items-center text-center space-y-4">
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-black text-brand-text-secondary uppercase tracking-widest">
                      <T>AI MATCH</T>
                    </span>
                    <h4 className="text-[10px] font-black text-brand-text-primary uppercase tracking-tight">
                      <T>CONFIDENCE</T>
                    </h4>
                  </div>

                  {/* Circular glowing ring indicator */}
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(156,163,175,0.08)" strokeWidth="1.5" />
                      <motion.circle
                        initial={{ strokeDasharray: "0 100" }}
                        animate={{ strokeDasharray: "94 100" }}
                        transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        stroke="var(--accent-primary)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-black text-brand-text-primary leading-none">94%</span>
                      <span className="text-[7px] font-black text-brand-primary uppercase tracking-widest mt-0.5">
                        <T>MATCH</T>
                      </span>
                    </div>
                  </div>

                  <span className="text-[8px] font-black text-brand-primary uppercase tracking-widest animate-pulse">
                    <T>STABLE_STATE</T>
                  </span>
                </div>

              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>


      {/* 3. DYNAMIC EXPLAINABLE AI — XGBOOST SHAP FLOW (Asymmetric Layout) */}
      <section className="py-24 relative z-10 border-t border-brand-border/60 bg-gradient-to-b from-transparent via-brand-primary/2 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left side: Editorial SHAP Explanation */}
            <div className="lg:col-span-5 space-y-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.25em] rounded-full border border-brand-primary/20">
                <Cpu size={11} />
                <T>MODEL REASONING DIAGNOSTICS</T>
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-brand-text-primary uppercase tracking-tight leading-none">
                <T>EXPLAINABLE FORECAST PIPELINES</T>
              </h2>
              <p className="text-brand-text-secondary font-medium leading-relaxed">
                <T>We refuse to supply "black box" prediction tables. AgroXAI parses feature logic in real-time, mapping exact SHAP (SHapley Additive exPlanations) variables visually so you can track how each environmental factor pushes prediction models forward or backward.</T>
              </p>

              {/* Custom micro-interactive feature list */}
              <div className="space-y-2">
                {SHAP_FEATURES.map((feat, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSHAPIndex(i)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex justify-between items-center ${
                      activeSHAPIndex === i 
                        ? 'bg-brand-surface border-brand-primary/40 shadow-sm' 
                        : 'bg-transparent border-brand-border hover:bg-brand-surface/10'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-black text-brand-text-primary uppercase">{feat.name}</span>
                      <p className="text-[10px] text-brand-text-secondary mt-1 font-medium">{feat.impact} Impact Factor</p>
                    </div>
                    <span className={`text-xs font-black uppercase tracking-wider ${feat.impact === 'Positive' ? 'text-brand-primary' : 'text-red-400'}`}>
                      {feat.impact === 'Positive' ? `+${feat.weight}%` : `${feat.weight}%`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right side: Interactive SHAP Visual Node Pipe Graphic */}
            <div className="lg:col-span-7 bg-brand-surface border border-brand-border/80 rounded-4xl p-6 md:p-8 relative min-h-[460px] flex flex-col justify-between">
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
              
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest">SHAP_FLOW_SCHEMATIC.SYS</span>
                <span className="px-2.5 py-0.5 bg-brand-primary/10 border border-brand-primary/20 rounded text-[9px] font-black text-brand-primary uppercase">MODEL RESOLUTION HIGH</span>
              </div>

              {/* Node pipeline trace graphic */}
              <div className="my-8 relative flex flex-col justify-center items-center h-48">
                {/* Simulated center hub node */}
                <div className="w-16 h-16 bg-brand-bg border border-brand-primary/30 rounded-2xl flex items-center justify-center text-brand-primary shadow-glow relative z-10">
                  <Cpu size={26} className="animate-spin" style={{ animationDuration: '8s' }} />
                  <div className="absolute inset-[-1px] rounded-2xl bg-gradient-to-tr from-brand-primary to-transparent opacity-50 animate-pulse" />
                </div>

                {/* Animated connectors */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  {/* Positive flow paths (emerald) */}
                  <path d="M 50,50 L 150,100" stroke="var(--accent-primary)" strokeWidth="1.5" strokeDasharray="4 4" className="animate-flow" style={{ opacity: 0.3 }} />
                  <path d="M 50,150 L 150,100" stroke="var(--accent-primary)" strokeWidth="1.5" strokeDasharray="4 4" className="animate-flow" style={{ opacity: 0.3 }} />
                  {/* Negative flow paths (red) */}
                  <path d="M 350,50 L 150,100" stroke="#F87171" strokeWidth="1.5" strokeDasharray="4 4" className="animate-flow" style={{ opacity: 0.3 }} />
                  <path d="M 350,150 L 150,100" stroke="#F87171" strokeWidth="1.5" strokeDasharray="4 4" className="animate-flow" style={{ opacity: 0.3 }} />
                </svg>

                {/* External floating nodes representing features */}
                <div className="absolute top-4 left-4 bg-brand-surface-inset border border-brand-border px-3 py-1.5 rounded-xl flex items-center gap-2">
                  <Thermometer size={12} className="text-brand-primary" />
                  <span className="text-[9px] font-black text-brand-text-primary uppercase">TEMP IN</span>
                </div>
                <div className="absolute bottom-4 left-4 bg-brand-surface-inset border border-brand-border px-3 py-1.5 rounded-xl flex items-center gap-2">
                  <CloudRain size={12} className="text-brand-primary" />
                  <span className="text-[9px] font-black text-brand-text-primary uppercase">RAIN IN</span>
                </div>
                <div className="absolute top-4 right-4 bg-brand-surface-inset border border-brand-border px-3 py-1.5 rounded-xl flex items-center gap-2">
                  <Activity size={12} className="text-red-400" />
                  <span className="text-[9px] font-black text-brand-text-primary uppercase">PH ALK</span>
                </div>
                <div className="absolute bottom-4 right-4 bg-brand-surface-inset border border-brand-border px-3 py-1.5 rounded-xl flex items-center gap-2">
                  <Compass size={12} className="text-brand-gold" />
                  <span className="text-[9px] font-black text-brand-text-primary uppercase">POTAS OUT</span>
                </div>
              </div>

              {/* Explanation of hovered feature */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSHAPIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="bg-brand-surface-inset border border-brand-border p-4 rounded-2xl"
                >
                  <span className="text-[9px] font-black text-brand-primary uppercase tracking-widest">ACTIVE DIAGNOSTIC EXPLANATION</span>
                  <h4 className="text-sm font-black text-brand-text-primary uppercase mt-1 mb-1">{SHAP_FEATURES[activeSHAPIndex].name}</h4>
                  <p className="text-brand-text-secondary text-xs font-medium leading-relaxed">{SHAP_FEATURES[activeSHAPIndex].detail}</p>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* 4. ACTIVE WEATHER SIMULATOR & COORDINATE TRACKER (The Playable Simulator) */}
      <section id="sandbox" className="py-24 relative z-10 border-t border-brand-border/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.25em] rounded-full border border-brand-primary/20 mb-4">
              <Globe size={11} />
              <T>ENVIRONMENTAL MATRIX SANDBOX</T>
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-brand-text-primary uppercase tracking-tight mb-4">
              <T>SIMULATE LOCAL MICRO-CLIMATES</T>
            </h2>
            <p className="text-brand-text-secondary font-medium text-sm">
              <T>Manually adjust precipitation metrics or toggle season presets to see the XGBoost predictive outcome adapt in real-time.</T>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Column (60%): Immersive map scan overlaying generated assets */}
            <div className="lg:col-span-7 bg-brand-surface border border-brand-border rounded-4xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden min-h-[480px]">
              {/* Image asset with scanning horizontal laser beam */}
              <div className="absolute inset-0 z-0">
                <img 
                  src="/images/agri_satellite_intel.png" 
                  alt="Geospatial satellite scanning frame" 
                  className="w-full h-full object-cover opacity-30"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-brand-surface/40 to-transparent" />
                {/* Active Laser Line Sweep */}
                <div className="absolute left-0 right-0 h-[2px] bg-brand-primary shadow-glow animate-scanner pointer-events-none" />
              </div>

              {/* Floating coordinates and status widgets */}
              <div className="relative z-10 flex justify-between items-start">
                <div className="bg-brand-bg/90 backdrop-blur-md border border-brand-border p-3.5 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-primary animate-ping" />
                    <span className="text-[10px] font-black uppercase text-brand-text-primary">SECTOR_SCAN_903</span>
                  </div>
                  <p className="text-[8px] font-black uppercase text-brand-text-secondary mt-1">LAT: 17.3850 | LON: 78.4867</p>
                </div>

                <div className="bg-brand-bg/90 backdrop-blur-md border border-brand-border/80 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                  <Sprout size={12} className="text-brand-primary" />
                  <span className="text-[9px] font-black text-brand-text-primary uppercase">CLIMATEPres: {activeClimate}</span>
                </div>
              </div>

              {/* Pulsing target map reticle */}
              <div className="absolute left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="relative flex items-center justify-center">
                  <div className="w-12 h-12 border-2 border-brand-primary border-dashed rounded-full animate-spin" style={{ animationDuration: '10s' }} />
                  <div className="absolute w-2 h-2 bg-brand-primary rounded-full shadow-glow" />
                </div>
              </div>

              {/* Dynamic simulated metrics display based on presets */}
              <div className="relative z-10 flex flex-wrap gap-3">
                <div className="bg-brand-bg/95 backdrop-blur-md border border-brand-border p-4 rounded-2xl flex items-center gap-3 shrink-0">
                  <Thermometer size={18} className="text-brand-primary" />
                  <div>
                    <span className="text-[8px] font-black text-brand-text-secondary uppercase">Temperature</span>
                    <p className="text-sm font-black text-brand-text-primary uppercase">{activeData.temp}°C</p>
                  </div>
                </div>

                <div className="bg-brand-bg/95 backdrop-blur-md border border-brand-border p-4 rounded-2xl flex items-center gap-3 shrink-0">
                  <Droplets size={18} className="text-brand-primary" />
                  <div>
                    <span className="text-[8px] font-black text-brand-text-secondary uppercase">Moisture Ratio</span>
                    <p className="text-sm font-black text-brand-text-primary uppercase">{activeData.humidity}%</p>
                  </div>
                </div>

                <div className="bg-brand-bg/95 backdrop-blur-md border border-brand-border p-4 rounded-2xl flex items-center gap-3 shrink-0">
                  <CloudRain size={18} className="text-brand-primary" />
                  <div>
                    <span className="text-[8px] font-black text-brand-text-secondary uppercase">Precipitation</span>
                    <p className="text-sm font-black text-brand-text-primary uppercase">{activeData.rain} mm</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (40%): Sandbox preset selector & match modules */}
            <div className="lg:col-span-5 bg-brand-surface border border-brand-border rounded-4xl p-6 md:p-8 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-brand-border">
                  <h3 className="text-lg font-black text-brand-text-primary uppercase tracking-tight">Environmental Matrices</h3>
                  <HelpCircle size={16} className="text-brand-text-secondary cursor-pointer" />
                </div>

                {/* Preset selectors */}
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest">Preset Profiles</span>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.keys(SIMULATED_PRESETS).map((p) => {
                      const isActive = activeClimate === p;
                      return (
                        <button
                          key={p}
                          onClick={() => selectClimate(p)}
                          className={`py-3.5 px-3 rounded-2xl border text-[10px] font-black uppercase tracking-wider transition-all ${
                            isActive 
                              ? 'bg-brand-primary text-slate-950 border-brand-primary shadow-glow' 
                              : 'bg-brand-surface-inset border-brand-border text-brand-text-primary hover:bg-brand-surface'
                          }`}
                        >
                          {p === 'Monsoon' && <CloudRain size={12} className="inline mr-1" />}
                          {p === 'Arid' && <Sun size={12} className="inline mr-1" />}
                          {p === 'Winter' && <Snowflake size={12} className="inline mr-1" />}
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Interactive sliders for soil chemicals */}
                <div className="space-y-4 pt-4 border-t border-brand-border/60">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-black uppercase">
                      <span className="text-brand-text-secondary">Soil Nitrogen (N) Ratio</span>
                      <span className="text-brand-primary">{soilNitrogen} mg/kg</span>
                    </div>
                    <input 
                      type="range" min="10" max="140" 
                      value={soilNitrogen} 
                      onChange={(e) => setSoilNitrogen(parseInt(e.target.value))}
                      className="w-full accent-brand-primary cursor-pointer bg-brand-surface-inset h-1.5 rounded-full outline-none border border-brand-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-black uppercase">
                      <span className="text-brand-text-secondary">Soil Potassium (K) Ratio</span>
                      <span className="text-brand-primary">{soilPotassium} mg/kg</span>
                    </div>
                    <input 
                      type="range" min="5" max="120" 
                      value={soilPotassium} 
                      onChange={(e) => setSoilPotassium(parseInt(e.target.value))}
                      className="w-full accent-brand-primary cursor-pointer bg-brand-surface-inset h-1.5 rounded-full outline-none border border-brand-border"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Sandbox predictions outcome box */}
              <div className="mt-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-surface-inset border border-brand-border rounded-3xl" />
                <div className="p-5 relative z-10 flex flex-col justify-between min-h-[140px]">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">SANDBOX TARGET OUTCOME</span>
                    <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[8px] font-black text-brand-primary uppercase">Calculated</span>
                  </div>

                  {isSandboxRunning ? (
                    <div className="py-4 flex items-center gap-3">
                      <Activity className="animate-spin text-brand-primary" size={18} />
                      <span className="text-xs font-black text-brand-text-secondary uppercase tracking-widest">Re-evaluating parameters...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4 pt-4">
                      <div>
                        <h4 className="text-xl font-black text-brand-text-primary uppercase tracking-tight">{activeData.name}</h4>
                        <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest mt-1">Recommended Season: {activeData.season}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] font-black text-brand-text-secondary uppercase">CONFIDENCE</span>
                        <p className="text-2xl font-black text-brand-primary">{activeData.confidence}%</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE MASTERPIECE BENTO CAPABILITY GRID (Asymmetric Layouts) */}
      <section className="py-24 relative z-10 border-t border-brand-border/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.25em] rounded-full border border-brand-primary/20 mb-4">
              <Sprout size={11} />
              <T>ENGINE FEATURES & CAPABILITIES</T>
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-brand-text-primary uppercase tracking-tight mb-4">
              <T>PRECISION AGRICULTURAL POWERHOUSE</T>
            </h2>
            <p className="text-brand-text-secondary font-medium">
              <T>Explore how our architectural features optimize every single step of your growth planning cycles.</T>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Large landscape image crop targeting */}
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

            {/* Card 2: Minimal pH indices */}
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

            {/* Card 3: Encrypted History logs */}
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

            {/* Card 4: Financial projections layout with asset */}
            <div className="bg-brand-surface border border-brand-border rounded-[2.5rem] p-6 col-span-1 md:col-span-2 min-h-[380px] flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute inset-0 z-0">
                <img 
                  src="/images/agri_recommendations_ui.png" 
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

      {/* 6. IMMERSIVE EDITORIAL ADVISORS REVIEWS */}
      <section className="py-24 relative z-10 border-t border-brand-border/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.25em] rounded-full border border-brand-primary/20 mb-4">
              <Shield size={11} />
              <T>PARTNER CREDIBILITY</T>
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-brand-text-primary uppercase tracking-tight mb-4">
              <T>TRUSTED BY PRESTIGIOUS AGENTS</T>
            </h2>
            <p className="text-brand-text-secondary font-medium text-sm">
              <T>Validated by leading agricultural research boards and specialized venture capitals globally.</T>
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

      {/* 7. ATMOSPHERIC CALL TO ACTION GATE */}
      <section className="py-24 relative z-10 border-t border-brand-border/60 bg-gradient-to-b from-transparent to-brand-primary/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative p-12 md:p-16 rounded-[3.5rem] bg-brand-surface border border-brand-border/80 shadow-premium overflow-hidden text-center">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-80 h-80 bg-brand-primary/15 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.25em] rounded-full border border-brand-primary/20 mx-auto">
                <Activity size={10} />
                <T>INITIALIZE FARM MAPS</T>
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-brand-text-primary uppercase tracking-tight leading-none animate-pulse">
                <T>READY TO OPTIMIZE YOUR FIELD?</T>
              </h2>
              <p className="text-brand-text-secondary font-medium text-base">
                <T>Connect with our trained model datasets, compute exact feature explanations, and access crop recommendations instantly.</T>
              </p>

              <div className="flex flex-wrap justify-center items-center gap-4">
                <MagneticButton>
                  <Link to="/recommend" className="btn-primary group h-14 px-8 flex items-center justify-center rounded-2xl relative overflow-hidden bg-brand-primary text-slate-950 font-black uppercase text-[11px] tracking-[0.2em]">
                    <span className="relative z-10 flex items-center gap-2">
                      <T>Get Best Crop Match</T>
                      <ArrowRight className="inline transition-transform group-hover:translate-x-1" size={16} />
                    </span>
                  </Link>
                </MagneticButton>

                <MagneticButton>
                  <a href="#sandbox" className="h-14 px-8 bg-brand-surface border border-brand-border hover:border-brand-primary/30 text-brand-text-primary hover:text-brand-primary font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl flex items-center justify-center transition-all">
                    <T>AGROXAI DEMO</T>
                  </a>
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. COMPLETE SECURE STACK FOOTER */}
      <footer className="relative border-t border-brand-border bg-brand-surface z-10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            {/* Col 1: Brand details */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-premium">
                  <Leaf className="text-slate-950" size={20} />
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
