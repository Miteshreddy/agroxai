import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Github, Twitter, Linkedin, Database, Cpu, BarChart } from 'lucide-react';
import T from './T';

const Footer = () => {
  return (
    <footer className="bg-white/40 dark:bg-slate-950/40 border-t border-slate-100 dark:border-white/5 pt-24 pb-12 px-6 backdrop-blur-md transition-colors duration-500">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 mb-24">
        <div className="space-y-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center shadow-premium">
              <Leaf className="text-brand-bg" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-brand-text-primary uppercase">
              Agro<span className="text-brand-primary italic">XAI</span>
            </span>
          </div>
          <T as="p" className="text-brand-text-secondary font-medium leading-relaxed max-w-sm">
            Revolutionizing agriculture through explainable artificial intelligence. Empowering farmers with precise, data-driven crop recommendations.
          </T>
          <div className="flex gap-4">
            <SocialLink icon={<Twitter size={20} />} href="#" />
            <SocialLink icon={<Linkedin size={20} />} href="#" />
            <SocialLink icon={<Github size={20} />} href="https://github.com/Miteshreddy/agroxai" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-6">
            <T as="h4" className="text-[10px] font-black uppercase text-brand-text-secondary tracking-[0.2em] opacity-50">Resources</T>
            <ul className="space-y-4">
              <li><Link to="/" className="text-brand-text-primary font-bold hover:text-brand-primary transition-colors"><T>Home</T></Link></li>
              <li><Link to="/recommend" className="text-brand-text-primary font-bold hover:text-brand-primary transition-colors"><T>Recommend</T></Link></li>
              <li><Link to="/history" className="text-brand-text-primary font-bold hover:text-brand-primary transition-colors"><T>History</T></Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <T as="h4" className="text-[10px] font-black uppercase text-brand-text-secondary tracking-[0.2em] opacity-50">Company</T>
            <ul className="space-y-4">
              <li><a href="#" className="text-brand-text-primary font-bold hover:text-brand-primary transition-colors"><T>Privacy</T></a></li>
              <li><a href="#" className="text-brand-text-primary font-bold hover:text-brand-primary transition-colors"><T>Contact</T></a></li>
              <li><a href="#" className="text-brand-text-primary font-bold hover:text-brand-primary transition-colors"><T>Science</T></a></li>
            </ul>
          </div>
        </div>

        <div className="space-y-8">
          <T as="h4" className="text-[10px] font-black uppercase text-brand-text-secondary tracking-[0.2em] opacity-50">Technology Stack</T>
          <div className="flex flex-wrap gap-3">
            <TechBadge icon={<Cpu size={14} />} label="XGBoost" />
            <TechBadge icon={<BarChart size={14} />} label="SHAP Model" />
            <TechBadge icon={<Database size={14} />} label="MongoDB" />
            <TechBadge icon={<Leaf size={14} />} label="Explainable AI" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-12 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-brand-text-secondary/60 text-[10px] font-black uppercase tracking-[0.2em]">
        <T as="p">© 2026 AgroXAI. Precision Farming Systems.</T>
        <T as="p">Built with ❤️ for sustainable agriculture</T>
      </div>
    </footer>
  );
};

const SocialLink = ({ icon, href }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="w-11 h-11 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-white/5 rounded-xl flex items-center justify-center text-brand-text-primary hover:bg-brand-primary hover:text-brand-bg hover:border-brand-primary transition-all duration-300">
    {icon}
  </a>
);

const TechBadge = ({ icon, label }) => (
  <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-white/5 rounded-xl text-brand-text-primary font-black text-[10px] uppercase tracking-wider shadow-sm hover:shadow-premium hover:border-brand-primary/20 transition-all cursor-default">
    <span className="text-brand-primary">{icon}</span>
    {label}
  </div>
);

export default Footer;
