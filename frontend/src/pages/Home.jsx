import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, ShieldCheck, Sprout, CheckCircle2, Leaf, MousePointer2, Play } from 'lucide-react';
import FloatingParticles from '../components/effects/FloatingParticles';
import T from '../components/T';

const HERO_IMAGES = [
  "/assets/hero1.png", // Generated: Sunrise Field
  "/assets/hero2.png", // Generated: Smart Tech
  "/assets/hero3.png", // Generated: Happy Farmer
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600", // Farm sunrise
  "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&q=80&w=1600"  // Rice terrace
];

const Home = () => {
  const [imgIndex, setImgIndex] = useState(0);
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  
  // Parallax effect: image moves slower than text
  const y = useTransform(scrollY, [0, 500], [0, 100]);

  useEffect(() => {
    // Preload images
    HERO_IMAGES.forEach((image) => {
      const img = new Image();
      img.src = image;
    });

    const timer = setInterval(() => {
      setImgIndex(prev => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      className="bg-brand-bg min-h-screen"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <FloatingParticles />
      <div className="noise-overlay" />
      <div className="fixed inset-0 gradient-bg-animated pointer-events-none z-0" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 overflow-hidden" ref={heroRef}>
        <div className="max-w-[1440px] mx-auto w-full px-6 flex flex-col lg:flex-row items-center gap-16">

          {/* Left Side: Content */}
          <div className="lg:w-[45%] z-20 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-2 text-brand-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-6 bg-brand-primary/5 w-fit px-4 py-1.5 rounded-full border border-brand-primary/10"
            >
              <Zap size={14} fill="currentColor" />
              <T>Powered by XGBoost + SHAP</T>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-6xl md:text-[5.5rem] font-black text-brand-text-primary leading-[0.85] tracking-tighter mb-8"
            >
              <T>GROW THE RIGHT CROP EVERY TIME.</T>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-brand-text-secondary max-w-lg mb-10 leading-relaxed font-medium"
            >
              <T>Join the next generation of precision farming with AgroXAI — where explainable machine learning meets the field.</T>
            </motion.p>

            <div className="flex flex-wrap gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
                <Link to="/recommend" className="btn-primary group">
                  <T>Start Recommendation</T>
                  <ArrowRight className="inline ml-1 transition-transform group-hover:translate-x-1" size={20} />
                </Link>
              </motion.div>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                onClick={scrollToHowItWorks}
                className="px-8 py-3.5 bg-white border border-slate-200 text-brand-text-primary rounded-3xl font-bold shadow-premium hover:shadow-premium-hover hover:-translate-y-1 transition-all"
              >
                <T>How it Works</T>
              </motion.button>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
                <Link to="/recommend?demo=true" className="flex items-center gap-2 px-6 py-3.5 text-brand-primary font-bold rounded-3xl border border-brand-primary/20 hover:bg-brand-primary/5 hover:-translate-y-1 transition-all">
                  <Play size={16} fill="currentColor" />
                  <T>Try Demo</T>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Right Side: Cinematic Image Section */}
          <div className="lg:w-[55%] relative w-full h-full lg:h-[700px]">
            <motion.div 
              style={{ y }}
              className="relative w-full h-full min-h-[500px] lg:min-h-full overflow-visible"
            >
              {/* Premium Glow Effect */}
              <div className="absolute -inset-10 bg-brand-primary/20 blur-[100px] rounded-full opacity-30 animate-pulse pointer-events-none" />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative w-full h-full rounded-[4rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-10"
              >
                <AnimatePresence initial={false}>
                  <motion.div
                    key={imgIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ opacity: { duration: 1.5, ease: "easeInOut" } }}
                    className="absolute inset-0"
                  >
                    <motion.img
                      src={HERO_IMAGES[imgIndex]}
                      alt="Modern Agriculture"
                      initial={{ scale: 1 }}
                      animate={{ scale: 1.05 }}
                      transition={{ duration: 6, ease: "linear" }}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
                
                {/* Cinematic gradient & vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-dark/60 via-transparent to-transparent opacity-80 z-20" />
                <div className="absolute inset-0 bg-brand-primary/5 mix-blend-multiply z-20" />
                <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.3)] z-20" />
              </motion.div>

              {/* Floating Badges (Repositioned for better visual balance) */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute top-10 -left-10 glass-card !p-5 !rounded-2xl shadow-premium-hover flex items-center space-x-3 border-white/40 z-30 float-animation"
              >
                <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="text-brand-primary" size={24} />
                </div>
                <div>
                  <T as="p" className="text-[10px] uppercase font-black text-brand-text-primary tracking-tighter opacity-40">Precision AI</T>
                  <T as="p" className="text-sm font-bold text-brand-text-primary">VERIFIED MATCH</T>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute bottom-10 -right-10 glass-card !p-5 !rounded-2xl shadow-premium-hover flex items-center space-x-3 border-white/40 z-30 float-animation-delayed"
              >
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="text-blue-500" size={24} />
                </div>
                <div>
                  <T as="p" className="text-[10px] uppercase font-black text-brand-text-primary tracking-tighter opacity-40">Healthy Growth</T>
                  <T as="p" className="text-sm font-bold text-brand-text-primary">92% CONFIDENCE</T>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bento Preview */}
      <section id="how-it-works" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="md:col-span-8 glass-card flex flex-col justify-between"
            >
              <div>
                <T as="h3" className="text-4xl font-black text-brand-text-primary mb-4 leading-tight">Scientific Backing</T>
                <T as="p" className="text-lg text-brand-text-secondary mb-8 max-w-xl font-medium leading-relaxed">Every prediction is cross-referenced with your local N-P-K soil values and seasonal trends.</T>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="badge-ai">
                  <CheckCircle2 size={14} /><T>Explainable AI</T>
                </div>
                <div className="badge-verified">
                  <Leaf size={14} /><T>Eco-Optimized</T>
                </div>
                <div className="badge-confidence">
                  <Zap size={14} /><T>High Accuracy</T>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              className="md:col-span-4 bg-brand-dark p-10 rounded-[2.5rem] flex flex-col justify-between group hover:shadow-premium-hover transition-all duration-500"
            >
              <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:rotate-12 group-hover:scale-110">
                <MousePointer2 className="text-white" size={32} />
              </div>
              <div>
                <T as="h3" className="text-3xl font-black text-white mb-4">Quick Analysis</T>
                <T as="p" className="text-white/60 text-sm font-medium leading-relaxed mb-8">Input farm metrics in under a minute and get instant results.</T>
                <div style={{ display: 'inline-block' }}>
                  <Link to="/recommend" className="text-brand-primary font-black uppercase tracking-widest text-xs flex items-center gap-2 group-hover:gap-4 transition-all">
                    <T>Try now</T> <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
