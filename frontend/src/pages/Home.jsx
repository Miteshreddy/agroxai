import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, ShieldCheck, Sprout, CheckCircle2, Leaf, MousePointer2 } from 'lucide-react';
import FloatingParticles from '../components/effects/FloatingParticles';
import T from '../components/T';

const Home = () => {
  return (
    <motion.div
      className="bg-brand-cream min-h-screen"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <FloatingParticles />
      <div className="noise-overlay" />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden">
        <div className="max-w-[1600px] mx-auto w-full px-6 flex flex-col md:flex-row items-center">

          {/* Left Side: Content */}
          <div className="md:w-[45%] z-10 py-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="flex items-center space-x-2 text-brand-green font-bold text-sm uppercase tracking-widest mb-6 bg-brand-green/5 w-fit px-4 py-1.5 rounded-full border border-brand-green/10"
            >
              <Zap size={16} fill="currentColor" />
              <T>Powered by XGBoost + SHAP</T>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 45, ease: "easeOut", delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-brand-dark leading-[0.9] tracking-tighter mb-8 overflow-hidden"
            >
              <T>GROW THE RIGHT CROP EVERY TIME.</T>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.2 }}
              className="text-xl text-brand-olive max-w-lg mb-10 leading-relaxed font-medium"
            >
              <T>Join the next generation of precision farming with AgroXAI — where explainable machine learning meets the field.</T>
            </motion.p>

            <div className="flex flex-wrap gap-4">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.15 }}
                style={{ display: 'inline-block' }}
              >
                <Link to="/recommend" className="btn-primary group block">
                  <T>Start Recommendation</T>
                  <ArrowRight className="inline ml-2 transition-transform group-hover:translate-x-1" size={20} />
                </Link>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="px-8 py-3 bg-white border border-brand-olive/10 text-brand-dark rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <T>How it Works</T>
              </motion.button>
            </div>
          </div>

          {/* Right Side: Cinematic Image Card */}
          <div className="md:w-[55%] relative mt-12 md:mt-0 -mr-12 md:-mr-24 lg:-mr-32">
            <div className="relative aspect-video md:aspect-[4/3] lg:aspect-video w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 bg-brand-green rounded-l-[10rem] md:rounded-l-[20rem] rounded-r-3xl overflow-hidden shadow-2xl border-l-[16px] md:border-l-[32px] border-brand-green"
              >
                <img
                  src="/hero_bg.png"
                  alt="Modern Agriculture"
                  className="w-full h-full object-cover opacity-90 transition-transform duration-[20s] hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent" />
              </motion.div>

              {/* Floating Badges */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -top-6 left-[10%] glass-card p-4 !rounded-2xl shadow-2xl flex items-center space-x-3 border-brand-gold/20 float-animation z-20"
              >
                <div className="w-10 h-10 bg-brand-gold/10 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="text-brand-gold" size={24} />
                </div>
                <div>
                  <T as="p" className="text-[10px] uppercase font-black text-brand-dark tracking-tighter opacity-40">Precision AI</T>
                  <T as="p" className="text-xs font-bold text-brand-dark">VERIFIED MATCH</T>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute -bottom-4 right-[15%] glass-card p-4 !rounded-2xl shadow-2xl flex items-center space-x-3 border-brand-green/20 float-animation-delayed z-20"
              >
                <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center">
                  <Sprout className="text-brand-green" size={24} />
                </div>
                <div>
                  <T as="p" className="text-[10px] uppercase font-black text-brand-dark tracking-tighter opacity-40">Healthy Growth</T>
                  <T as="p" className="text-xs font-bold text-brand-dark">98% OPTIMIZATION</T>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Preview */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="md:col-span-8 glass-card flex flex-col justify-between hover:scale-[1.02] transition-all"
            >
              <div>
                <T as="h3" className="text-4xl font-black text-brand-dark mb-4">Scientific Backing</T>
                <T as="p" className="text-lg text-brand-olive mb-8 max-w-xl">Every prediction is cross-referenced with your local N-P-K soil values and seasonal trends.</T>
              </div>
              <div className="flex gap-4">
                <div className="bg-brand-green/5 px-4 py-2 rounded-xl text-brand-green font-bold text-sm flex items-center gap-2">
                  <CheckCircle2 size={16} /><T>Explainable AI</T>
                </div>
                <div className="bg-brand-gold/5 px-4 py-2 rounded-xl text-brand-gold font-bold text-sm flex items-center gap-2">
                  <Leaf size={16} /><T>Eco-Optimized</T>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
              className="md:col-span-4 bg-brand-dark p-8 rounded-[2rem] flex flex-col justify-between group hover:scale-[1.02] transition-all"
            >
              <div className="w-16 h-16 bg-brand-green rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:rotate-12">
                <MousePointer2 className="text-brand-gold" size={32} />
              </div>
              <div>
                <T as="h3" className="text-3xl font-black text-white mb-4">Quick Analysis</T>
                <T as="p" className="text-white/60 text-sm leading-relaxed mb-6">Input farm metrics in under a minute and get instant results.</T>
                <div style={{ display: 'inline-block' }}>
                  <Link to="/recommend" className="text-brand-green font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                    <T>Try now</T> <ArrowRight size={18} />
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
