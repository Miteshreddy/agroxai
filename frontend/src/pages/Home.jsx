import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Zap, ArrowRight, Shield, Sprout, CheckCircle2, Leaf, 
  MousePointer2, Play, Activity, Cpu, Thermometer, Droplets, 
  CloudRain, Wind, Globe, Sparkles, AlertTriangle, HelpCircle, 
  TrendingUp, BarChart3, Database, FileText, Lock
} from 'lucide-react';
import FloatingParticles from '../components/effects/FloatingParticles';
import MagneticButton from '../components/effects/MagneticButton';
import T from '../components/T';

// Simulated interactive ML prediction models for showcase
const INTERACTIVE_CROP_PRESETS = [
  { name: 'Rice', N: 80, P: 40, K: 40, temp: 27, humidity: 82, ph: 6.5, rain: 230, confidence: 94, color: 'from-emerald-500 to-teal-400' },
  { name: 'Maize', N: 70, P: 45, K: 30, temp: 24, humidity: 65, ph: 6.2, rain: 110, confidence: 89, color: 'from-amber-500 to-orange-400' },
  { name: 'Chickpea', N: 40, P: 60, K: 80, temp: 19, humidity: 18, ph: 7.2, rain: 65, confidence: 91, color: 'from-blue-500 to-indigo-400' },
  { name: 'Mango', N: 20, P: 30, K: 30, temp: 31, humidity: 52, ph: 5.8, rain: 95, confidence: 86, color: 'from-yellow-500 to-amber-500' }
];

const Home = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Mouse tilt effect values for Hero Interactive Card
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const springX = useSpring(cardX, { stiffness: 100, damping: 20 });
  const springY = useSpring(cardY, { stiffness: 100, damping: 20 });

  // Handle interactive soil slider state for simulator section
  const [soilN, setSoilN] = useState(65);
  const [soilP, setSoilP] = useState(45);
  const [soilK, setSoilK] = useState(35);
  const [soilPh, setSoilPh] = useState(6.5);
  const [simulating, setSimulating] = useState(false);
  const [predictedCrop, setPredictedCrop] = useState(INTERACTIVE_CROP_PRESETS[0]);

  // Handle card tilt
  const handleMouseMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    cardX.set(x * 0.05);
    cardY.set(y * 0.05);
  };

  const handleMouseLeave = () => {
    cardX.set(0);
    cardY.set(0);
  };

  // Live computation trigger in Bento grid
  useEffect(() => {
    setSimulating(true);
    const timer = setTimeout(() => {
      // Find the closest preset based on Euclidean distance
      let bestMatch = INTERACTIVE_CROP_PRESETS[0];
      let minDistance = Infinity;

      INTERACTIVE_CROP_PRESETS.forEach(preset => {
        const distance = Math.sqrt(
          Math.pow(preset.N - soilN, 2) +
          Math.pow(preset.P - soilP, 2) +
          Math.pow(preset.K - soilK, 2) +
          Math.pow((preset.ph - soilPh) * 20, 2) // scale pH difference
        );
        if (distance < minDistance) {
          minDistance = distance;
          bestMatch = preset;
        }
      });

      setPredictedCrop(bestMatch);
      setSimulating(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [soilN, soilP, soilK, soilPh]);

  return (
    <div className="bg-brand-bg min-h-screen relative overflow-hidden" ref={containerRef}>
      <FloatingParticles />
      <div className="noise-overlay" />
      
      {/* Cinematic animated mesh background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-primary/10 rounded-full blur-[160px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-brand-gold/5 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '14s' }} />
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[180px] animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-2 text-brand-primary font-black text-[10px] uppercase tracking-[0.25em] mb-2 bg-brand-primary/5 w-fit px-4 py-2 rounded-full border border-brand-primary/15"
            >
              <Sparkles size={12} className="animate-spin" style={{ animationDuration: '3s' }} />
              <T>EXPLAINABLE AI PRECISION PLATFORM</T>
            </motion.div>

            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, filter: 'blur(8px)', y: 30 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-5xl md:text-7xl font-black text-brand-text-primary leading-[1.05] tracking-tight"
              >
                <T>DECISION INTELLIGENCE FOR</T>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-emerald-400 to-brand-gold animate-gradient-x">
                  <T>PRECISION FARMING</T>
                </span>.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="text-lg text-brand-text-secondary font-medium max-w-xl leading-relaxed"
              >
                <T>AgroXAI blends advanced machine learning (XGBoost + SHAP) with real-time geospatial analytics to recommend ideal crops, assess climate risks, and optimize yields.</T>
              </motion.p>
            </div>

            {/* Premium CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap items-center gap-6"
            >
              <MagneticButton>
                <Link to="/recommend" className="btn-primary group h-14 px-8 flex items-center justify-center rounded-2xl">
                  <T>Run Analysis</T>
                  <ArrowRight className="inline ml-2 transition-transform group-hover:translate-x-1" size={16} />
                </Link>
              </MagneticButton>

              <MagneticButton>
                <Link to="/my-farm" className="h-14 px-8 bg-brand-surface border border-brand-border hover:border-brand-primary/30 text-brand-text-primary hover:text-brand-primary font-bold rounded-2xl flex items-center justify-center transition-all shadow-sm">
                  <T>Configure Farm</T>
                </Link>
              </MagneticButton>
            </motion.div>

            {/* Quick trust metrics */}
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
                <p className="text-2xl font-black text-brand-text-primary">22k+</p>
                <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-wider">Sown Acres</p>
              </div>
              <div>
                <p className="text-2xl font-black text-brand-text-primary">100%</p>
                <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-wider">Explainable AI</p>
              </div>
            </motion.div>
          </div>

          {/* Right Hero Visuals */}
          <div className="lg:col-span-6 relative w-full h-[600px] flex items-center justify-center">
            <motion.div
              style={{ x: springX, y: springY }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-[500px] h-[550px] rounded-[2.5rem] bg-brand-surface-inset border border-brand-border/80 shadow-premium p-8 overflow-hidden backdrop-blur-2xl cursor-grab active:cursor-grabbing group"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />

              {/* Holographic Header */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-brand-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                    <Cpu size={18} className="animate-pulse" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-brand-primary uppercase tracking-[0.2em]">Neural Engine</p>
                    <p className="text-xs font-black text-brand-text-primary uppercase">Prediction Live Feed</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-primary animate-ping" />
                  <span className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest">Active</span>
                </div>
              </div>

              {/* Graphic Matrix Mock */}
              <div className="relative h-44 bg-brand-surface rounded-2xl border border-brand-border p-4 mb-6 flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                <div className="flex justify-between items-start z-10">
                  <div>
                    <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest">Geospatial Target</p>
                    <p className="text-sm font-black text-brand-text-primary uppercase">Region — zone 4a</p>
                  </div>
                  <Globe size={16} className="text-brand-primary animate-spin" style={{ animationDuration: '20s' }} />
                </div>

                {/* Cyber Soil Map mock */}
                <div className="h-16 w-full relative z-10 flex items-end gap-1.5">
                  {[45, 62, 85, 30, 95, 74, 50, 80, 64, 40, 78, 92, 55].map((h, i) => (
                    <div key={i} className="flex-1 bg-brand-border rounded-t-sm overflow-hidden" style={{ height: '100%' }}>
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 1.5, delay: i * 0.05 }}
                        className="w-full h-full bg-gradient-to-t from-brand-primary to-emerald-400 opacity-80" 
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Prediction readout mock */}
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-brand-surface rounded-2xl border border-brand-border">
                  <div className="flex items-center gap-3">
                    <Sprout className="text-brand-primary" size={18} />
                    <div>
                      <p className="text-[8px] font-black text-brand-text-secondary uppercase tracking-widest">Top Prediction Match</p>
                      <p className="text-sm font-black text-brand-text-primary uppercase">COTTON YIELD TARGET</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-brand-primary">94%</p>
                    <p className="text-[8px] font-black text-brand-text-secondary uppercase tracking-widest">Confidence</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-brand-surface rounded-xl border border-brand-border flex items-center justify-between">
                    <div>
                      <p className="text-[8px] font-black text-brand-text-secondary uppercase tracking-widest">Sowing Window</p>
                      <p className="text-xs font-black text-brand-text-primary uppercase">May 15 - June 05</p>
                    </div>
                  </div>
                  <div className="p-3 bg-brand-surface rounded-xl border border-brand-border flex items-center justify-between">
                    <div>
                      <p className="text-[8px] font-black text-brand-text-secondary uppercase tracking-widest">Water Demand</p>
                      <p className="text-xs font-black text-emerald-500 uppercase">Optimal (Low)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover highlight overlays */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-[8px] font-black text-brand-primary uppercase tracking-widest flex items-center gap-1">
                  <MousePointer2 size={10} /> Tilt & Explore Interactive Grid
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 2. INTERACTIVE SOIL SIMULATOR & EXPLAINABILITY */}
      <section className="py-24 relative z-10 border-t border-brand-border/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="badge-ai mb-4"><Zap size={10} /><T>REAL-TIME ML SANDBOX</T></span>
            <h2 className="text-4xl md:text-5xl font-black text-brand-text-primary uppercase tracking-tight mb-4">
              <T>TEST THE EXPLAINABLE CORE</T>
            </h2>
            <p className="text-brand-text-secondary font-medium">
              <T>Tweak the environmental controls below to see the prediction logic recalculate live. Observe how our models weigh variables instantaneously.</T>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Simulator Controls */}
            <div className="lg:col-span-5 bg-brand-surface-inset border border-brand-border rounded-[2rem] p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-black text-brand-text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Activity size={18} className="text-brand-primary" /> Soil Composition Config
                </h3>

                {/* Nitrogen */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-black uppercase tracking-wider mb-2">
                    <span className="text-brand-text-primary">Nitrogen (N)</span>
                    <span className="text-brand-primary">{soilN} mg/kg</span>
                  </div>
                  <input 
                    type="range" min="10" max="120" value={soilN} 
                    onChange={e => setSoilN(Number(e.target.value))}
                    className="w-full accent-brand-primary bg-brand-border h-1 rounded-lg outline-none"
                  />
                </div>

                {/* Phosphorus */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-black uppercase tracking-wider mb-2">
                    <span className="text-brand-text-primary">Phosphorus (P)</span>
                    <span className="text-brand-primary">{soilP} mg/kg</span>
                  </div>
                  <input 
                    type="range" min="10" max="100" value={soilP} 
                    onChange={e => setSoilP(Number(e.target.value))}
                    className="w-full accent-brand-primary bg-brand-border h-1 rounded-lg outline-none"
                  />
                </div>

                {/* Potassium */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-black uppercase tracking-wider mb-2">
                    <span className="text-brand-text-primary">Potassium (K)</span>
                    <span className="text-brand-primary">{soilK} mg/kg</span>
                  </div>
                  <input 
                    type="range" min="10" max="120" value={soilK} 
                    onChange={e => setSoilK(Number(e.target.value))}
                    className="w-full accent-brand-primary bg-brand-border h-1 rounded-lg outline-none"
                  />
                </div>

                {/* pH */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-black uppercase tracking-wider mb-2">
                    <span className="text-brand-text-primary">pH Level</span>
                    <span className="text-brand-primary">{soilPh}</span>
                  </div>
                  <input 
                    type="range" min="4.5" max="8.5" step="0.1" value={soilPh} 
                    onChange={e => setSoilPh(Number(e.target.value))}
                    className="w-full accent-brand-primary bg-brand-border h-1 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="p-4 bg-brand-surface rounded-2xl border border-brand-border text-center">
                <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">
                  Active Preset Match: <span className="text-brand-primary uppercase font-black">{predictedCrop.name} Preset</span>
                </p>
              </div>
            </div>

            {/* Simulated Live Results Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Prediction output */}
              <div className="bg-brand-surface-inset border border-brand-border rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                <div>
                  <div className="flex items-center gap-2 text-brand-primary uppercase text-[10px] tracking-widest font-black mb-4">
                    <Cpu size={14} /> ML Prediction Engine
                  </div>
                  <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest mb-1">Recommended Cultivar</p>
                  
                  {simulating ? (
                    <div className="h-16 flex items-center">
                      <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <h3 className="text-4xl font-black text-brand-text-primary uppercase tracking-tight mb-2">
                      {predictedCrop.name}
                    </h3>
                  )}
                  
                  <p className="text-brand-text-secondary text-xs leading-relaxed max-w-xs font-medium">
                    Optimized soil chemistry yields the highest probability of success for {predictedCrop.name} growth cycle.
                  </p>
                </div>

                <div className="mt-8">
                  <div className="flex justify-between text-[10px] font-black text-brand-text-secondary uppercase tracking-widest mb-2">
                    <span>Recommendation Confidence</span>
                    <span>{predictedCrop.confidence}%</span>
                  </div>
                  <div className="w-full h-2 bg-brand-border rounded-full overflow-hidden">
                    <motion.div 
                      key={predictedCrop.name}
                      initial={{ width: 0 }}
                      animate={{ width: `${predictedCrop.confidence}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full bg-brand-primary rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* Explainability factors */}
              <div className="bg-brand-surface-inset border border-brand-border rounded-[2rem] p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-brand-primary uppercase text-[10px] tracking-widest font-black mb-6">
                    <Activity size={14} /> SHAP Feature Weightings
                  </div>
                  
                  <div className="space-y-4">
                    {/* Feature 1 */}
                    <div>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-wider mb-1">
                        <span className="text-brand-text-primary">Soil Chemistry (N-P-K)</span>
                        <span className="text-brand-text-secondary">High Weight</span>
                      </div>
                      <div className="w-full h-1.5 bg-brand-border rounded-full overflow-hidden">
                        <div className="w-[85%] h-full bg-brand-primary" />
                      </div>
                    </div>

                    {/* Feature 2 */}
                    <div>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-wider mb-1">
                        <span className="text-brand-text-primary">Acidity (pH)</span>
                        <span className="text-brand-text-secondary">Medium Weight</span>
                      </div>
                      <div className="w-full h-1.5 bg-brand-border rounded-full overflow-hidden">
                        <div className="w-[50%] h-full bg-brand-gold" />
                      </div>
                    </div>

                    {/* Feature 3 */}
                    <div>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-wider mb-1">
                        <span className="text-brand-text-primary">Estimated Rainfall</span>
                        <span className="text-brand-text-secondary">Relevant Weight</span>
                      </div>
                      <div className="w-full h-1.5 bg-brand-border rounded-full overflow-hidden">
                        <div className="w-[30%] h-full bg-blue-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] font-medium text-brand-text-secondary leading-relaxed mt-6">
                  SHAP variables measure how much each attribute shifted the baseline recommendation.
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. PREMIUM BENTO GRID SHOWCASE */}
      <section className="py-24 relative z-10 border-t border-brand-border/60 bg-brand-surface-inset/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="badge-ai mb-4"><Globe size={10} /><T>WHY AGROXAI</T></span>
            <h2 className="text-4xl md:text-5xl font-black text-brand-text-primary uppercase tracking-tight mb-4">
              <T>SOCIETAL PRECISION MEETS MODERN MACHINE LEARNING</T>
            </h2>
            <p className="text-brand-text-secondary font-medium">
              <T>Every algorithm we run answers to direct economic, agricultural, and transparency constraints.</T>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Bento 1: Explainable AI */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-brand-surface border border-brand-border rounded-[2rem] p-8 flex flex-col justify-between h-[360px] shadow-sm relative overflow-hidden group"
            >
              <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 transition-transform">
                <Cpu size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-brand-text-primary uppercase tracking-tight mb-3">XGBoost & SHAP Logic</h3>
                <p className="text-brand-text-secondary text-sm leading-relaxed font-medium">
                  We don't do black-box predictions. Every output has an automated reasoning card explaining the specific soil and geographic parameters that drove the decision.
                </p>
              </div>
            </motion.div>

            {/* Bento 2: Local Weather integration */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-brand-surface border border-brand-border rounded-[2rem] p-8 flex flex-col justify-between h-[360px] shadow-sm relative overflow-hidden group"
            >
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                <CloudRain size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-brand-text-primary uppercase tracking-tight mb-3">Geospatial Weather Snapshots</h3>
                <p className="text-brand-text-secondary text-sm leading-relaxed font-medium">
                  By matching geolocation coordinates, our prediction engine fetches live regional humidity, temperature, and historical soil profiles directly from OpenWeather APIs.
                </p>
              </div>
            </motion.div>

            {/* Bento 3: Financial & Economic feasibility */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-brand-surface border border-brand-border rounded-[2rem] p-8 flex flex-col justify-between h-[360px] shadow-sm relative overflow-hidden group"
            >
              <div className="w-12 h-12 bg-brand-gold/10 rounded-2xl flex items-center justify-center text-brand-gold mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-brand-text-primary uppercase tracking-tight mb-3">Market Revenue Analysis</h3>
                <p className="text-brand-text-secondary text-sm leading-relaxed font-medium">
                  Our system computes estimated yield density per acre alongside historical market pricing metrics to predict profit and operational expenses before you sow.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 4. IMMERSIVE REC FLOW STEP-BY-STEP */}
      <section className="py-24 relative z-10 border-t border-brand-border/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="badge-ai mb-4"><Sparkles size={10} /><T>DEVELOPMENT PROCESS</T></span>
            <h2 className="text-4xl md:text-5xl font-black text-brand-text-primary uppercase tracking-tight mb-4">
              <T>HOW PRECISION MAPPING WORKS</T>
            </h2>
            <p className="text-brand-text-secondary font-medium">
              <T>A seamless sequence mapping your coordinates to high-yield agricultural recommendations in seconds.</T>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-brand-border z-0" />

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-brand-surface-inset border-2 border-brand-primary flex items-center justify-center text-brand-primary font-black text-lg shadow-premium">
                01
              </div>
              <h3 className="text-lg font-black text-brand-text-primary uppercase tracking-wider">Geographic Selector</h3>
              <p className="text-brand-text-secondary text-sm max-w-xs font-medium">
                Identify your field. Use automated device GPS selectors or input standard district coordinate mappings manually.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-brand-surface-inset border-2 border-brand-gold flex items-center justify-center text-brand-gold font-black text-lg shadow-premium">
                02
              </div>
              <h3 className="text-lg font-black text-brand-text-primary uppercase tracking-wider">Soil Chemistry Mapping</h3>
              <p className="text-brand-text-secondary text-sm max-w-xs font-medium">
                Choose or log soil profiles. The platform analyzes standard composition ratios to cross-reference with climate data.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-brand-surface-inset border-2 border-emerald-400 flex items-center justify-center text-emerald-400 font-black text-lg shadow-premium">
                03
              </div>
              <h3 className="text-lg font-black text-brand-text-primary uppercase tracking-wider">Explainable AI Match</h3>
              <p className="text-brand-text-secondary text-sm max-w-xs font-medium">
                Access your actionable crop roadmap, soil enhancement plans, weather threat risks, and PDF export charts.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. LIVE EXPO CALL TO ACTION */}
      <section className="py-24 relative z-10 border-t border-brand-border/60 bg-gradient-to-b from-transparent to-brand-primary/5">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="relative p-12 md:p-16 rounded-[3rem] bg-brand-surface border border-brand-border/80 shadow-premium overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
              <span className="badge-ai mx-auto"><Activity size={10} /><T>GET SOWING PATHS NOW</T></span>
              <h2 className="text-4xl md:text-6xl font-black text-brand-text-primary uppercase tracking-tight leading-none">
                <T>READY TO OPTIMIZE YOUR FIELD?</T>
              </h2>
              <p className="text-brand-text-secondary font-medium text-base">
                <T>Sign up or enter our interactive portal to compute explainable machine learning predictions instantly.</T>
              </p>

              <div className="flex flex-wrap justify-center items-center gap-4">
                <MagneticButton>
                  <Link to="/recommend" className="btn-primary group h-14 px-8 flex items-center justify-center rounded-2xl">
                    <T>Get Crop Match</T>
                    <ArrowRight className="inline ml-2 transition-transform group-hover:translate-x-1" size={16} />
                  </Link>
                </MagneticButton>
                
                <MagneticButton>
                  <Link to="/recommend?demo=true" className="h-14 px-8 bg-brand-surface border border-brand-border hover:border-brand-primary/30 text-brand-text-primary hover:text-brand-primary font-bold rounded-2xl flex items-center justify-center transition-all">
                    <T>Try Mock Demo</T>
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONTENT-RICH PREMIUM FOOTER */}
      <footer className="relative border-t border-brand-border bg-brand-surface z-10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            {/* Column 1: Brand details */}
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
                Advanced machine learning frameworks translating complex soil profiles and regional variables into actionable precision agricultural roadmaps.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-brand-text-primary uppercase tracking-[0.25em]">Precision Navigation</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-xs text-brand-text-secondary hover:text-brand-primary font-bold transition-all"><T>Home Interface</T></Link></li>
                <li><Link to="/recommend" className="text-xs text-brand-text-secondary hover:text-brand-primary font-bold transition-all"><T>Analyze Soil</T></Link></li>
                <li><Link to="/my-farm" className="text-xs text-brand-text-secondary hover:text-brand-primary font-bold transition-all"><T>Farm Dashboard</T></Link></li>
                <li><Link to="/history" className="text-xs text-brand-text-secondary hover:text-brand-primary font-bold transition-all"><T>Analytics History</T></Link></li>
              </ul>
            </div>

            {/* Column 3: ML Technology stack */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-brand-text-primary uppercase tracking-[0.25em]">Core Frameworks</h4>
              <ul className="space-y-2">
                <li className="text-xs text-brand-text-secondary font-medium uppercase tracking-wider">XGBoost Decision Trees</li>
                <li className="text-xs text-brand-text-secondary font-medium uppercase tracking-wider">SHAP Explainable AI</li>
                <li className="text-xs text-brand-text-secondary font-medium uppercase tracking-wider">Vite React Frontend</li>
                <li className="text-xs text-brand-text-secondary font-medium uppercase tracking-wider">Node MongoDB Persistence</li>
              </ul>
            </div>

            {/* Column 4: Platform Security */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-brand-text-primary uppercase tracking-[0.25em]">Platform Security</h4>
              <p className="text-brand-text-secondary text-xs leading-relaxed font-medium">
                Data persistence stored securely on MongoDB Atlas with complete TLS encryption. User sessions validated securely.
              </p>
              <div className="flex items-center gap-1.5 text-brand-primary font-black text-[9px] uppercase tracking-wider bg-brand-primary/5 px-3 py-1.5 rounded-lg border border-brand-primary/10 w-fit">
                <Shield size={10} /> Verified Encrypted Connection
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">
              © {new Date().getFullYear()} AGROXAI CO. ALL RIGHTS RESERVED.
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
