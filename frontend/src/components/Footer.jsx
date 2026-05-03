import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Github, Twitter, Linkedin, Database, Cpu, BarChart } from 'lucide-react';
import T from './T';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-brand-green/5 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mb-20">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center shadow-lg">
              <Leaf className="text-brand-gold" size={20} />
            </div>
            <span className="text-xl font-black tracking-tighter text-brand-dark uppercase">
              Agro<span className="text-brand-green italic">XAI</span>
            </span>
          </div>
          <T as="p" className="text-brand-olive font-medium leading-relaxed max-w-sm">
            Revolutionizing agriculture through explainable artificial intelligence. Empowering farmers with precise, data-driven crop recommendations.
          </T>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-brand-green/5 rounded-full flex items-center justify-center text-brand-dark hover:bg-brand-green hover:text-white transition-all"><Twitter size={18} /></a>
            <a href="#" className="w-10 h-10 bg-brand-green/5 rounded-full flex items-center justify-center text-brand-dark hover:bg-brand-green hover:text-white transition-all"><Linkedin size={18} /></a>
            <a href="#" className="w-10 h-10 bg-brand-green/5 rounded-full flex items-center justify-center text-brand-dark hover:bg-brand-green hover:text-white transition-all"><Github size={18} /></a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <T as="h4" className="text-[10px] font-black uppercase text-brand-olive tracking-widest opacity-40">Resources</T>
            <ul className="space-y-3">
              <li><Link to="/" className="text-brand-dark font-bold hover:text-brand-green transition-colors"><T>Home</T></Link></li>
              <li><Link to="/recommend" className="text-brand-dark font-bold hover:text-brand-green transition-colors"><T>Recommend</T></Link></li>
              <li><Link to="/history" className="text-brand-dark font-bold hover:text-brand-green transition-colors"><T>History</T></Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <T as="h4" className="text-[10px] font-black uppercase text-brand-olive tracking-widest opacity-40">Company</T>
            <ul className="space-y-3">
              <li><a href="#" className="text-brand-dark font-bold hover:text-brand-green transition-colors"><T>Privacy</T></a></li>
              <li><a href="#" className="text-brand-dark font-bold hover:text-brand-green transition-colors"><T>Contact</T></a></li>
              <li><a href="#" className="text-brand-dark font-bold hover:text-brand-green transition-colors"><T>Science</T></a></li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <T as="h4" className="text-[10px] font-black uppercase text-brand-olive tracking-widest opacity-40">Technology Stack</T>
          <div className="flex flex-wrap gap-2">
            <TechBadge icon={<Cpu size={14} />} label="XGBoost" />
            <TechBadge icon={<BarChart size={14} />} label="SHAP Model" />
            <TechBadge icon={<Database size={14} />} label="MongoDB" />
            <TechBadge icon={<Leaf size={14} />} label="Explainable AI" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-10 border-t border-brand-green/5 flex flex-col md:flex-row items-center justify-between gap-4 text-brand-olive/50 text-xs font-bold uppercase tracking-widest">
        <T as="p">© 2026 AgroXAI. Precision Farming Systems.</T>
        <T as="p">Built with ❤️ for sustainable agriculture</T>
      </div>
    </footer>
  );
};

const TechBadge = ({ icon, label }) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-brand-green/5 border border-brand-green/10 rounded-xl text-brand-dark font-bold text-[10px] uppercase tracking-wider shadow-sm hover:shadow-md hover:border-brand-green/30 transition-all cursor-default">
    <span className="text-brand-green">{icon}</span>
    {label}
  </div>
);

export default Footer;
