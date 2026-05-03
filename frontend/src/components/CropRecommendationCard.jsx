import React from 'react';
import { CheckCircle } from 'lucide-react';
import T from './T';

const CropRecommendationCard = ({ crop, confidence, season, result }) => {
    return (
        <div className="bg-brand-dark rounded-[2.5rem] p-10 mb-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                <CheckCircle size={12} className="text-brand-green" />
                <T as="span" className="text-[10px] font-black text-white uppercase tracking-widest">AGROKAI VERIFIED</T>
            </div>

            <T as="p" className="text-brand-green font-black text-[10px] uppercase tracking-[0.3em] mb-3">Recommended Crop</T>
            <h2 className="text-7xl md:text-9xl font-black text-white tracking-tighter italic leading-none mb-8 capitalize">
                <T>{crop}</T>
            </h2>

            <div className="flex flex-wrap gap-3">
                <span className="flex items-center gap-2 bg-white/10 border border-white/10 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full">
                    <span className="w-1.5 h-1.5 bg-brand-green rounded-full" />
                    <T>Confidence</T>: {(confidence * 100).toFixed(1)}%
                </span>
                <span className="flex items-center gap-2 bg-white/10 border border-white/10 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full">
                    <CheckCircle size={12} className="text-brand-green" /> <T>Soil Advice Included</T>
                </span>
                <span className="flex items-center gap-2 bg-white/10 border border-white/10 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full">
                    🗓️ <T>{season}</T>
                </span>
                {result?.climate_zone && (
                    <span className="flex items-center gap-2 bg-white/10 border border-white/10 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full">
                        🌍 <T>{result.climate_zone}</T>
                    </span>
                )}
            </div>

            {/* Alternative crops */}
            {result?.recommended_crops && result.recommended_crops.length > 1 && (
                <div className="mt-8 pt-6 border-t border-white/10">
                    <T as="p" className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Alternative Crops</T>
                    <div className="flex gap-3 flex-wrap">
                        {result.recommended_crops.slice(1).map((c, i) => (
                            <span key={i} className="px-4 py-1.5 bg-white/5 border border-white/10 text-white/70 text-xs font-bold rounded-full capitalize">
                                #{i + 2} <T>{c.crop}</T> — {(c.confidence * 100).toFixed(0)}%
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Soil treatment snippet */}
            {result?.mapped_values && (
                <div className="mt-8 bg-white/5 border border-white/10 rounded-3xl p-6 flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-gold/20 rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-lg">🗺️</span>
                    </div>
                    <div>
                        <T as="p" className="text-[10px] font-black text-brand-green uppercase tracking-widest mb-1">Soil Treatment Recommendation</T>
                        <T as="p" className="text-sm text-white/70 font-medium">
                            {result.mapped_values.N >= 50 && result.mapped_values.P >= 40 && result.mapped_values.K >= 40
                                ? 'Soil nutrient balance is optimal for high yield.'
                                : `Supplement soil — N: ${result.mapped_values.N}, P: ${result.mapped_values.P}, K: ${result.mapped_values.K}, pH: ${result.mapped_values.ph?.toFixed(1)}`
                            }
                        </T>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CropRecommendationCard;
