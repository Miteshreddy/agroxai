import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Navigation, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import LocationSearch from './LocationSearch';

const API = import.meta.env.VITE_API_URL || 'https://agroxai.onrender.com/api';

const LocationSelector = ({ onLocationSelect, loading }) => {
    const [locationMode, setLocationMode] = useState('current');
    const [manualLocation, setManualLocation] = useState({ state: '', district: '' });
    const [selectedCoords, setSelectedCoords] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [locationLabel, setLocationLabel] = useState('');

    const fetchAndDisplayWeather = async (lat, lon, label = '') => {
        setIsLoading(true);
        setError('');
        try {
            const res = await axios.get(`${API}/weather`, { params: { lat, lon }, timeout: 15000 });
            const data = res.data.data; // Extract from success wrapper
            setWeatherData(data);
            const resolvedCity = data.location?.city || label || 'Selected Location';
            setLocationLabel(resolvedCity);
            onLocationSelect({ lat, lon, weatherData: data, mode: locationMode });
            toast.success('✅ Weather locked!');
        } catch (err) {
            setError('Backend connection failed. Check if server is on port 5005.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAutoGPS = () => {
        if (!navigator.geolocation) {
            setError('GPS not supported by browser.');
            return;
        }
        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => fetchAndDisplayWeather(pos.coords.latitude, pos.coords.longitude, 'GPS Location'),
            () => {
                setError('GPS Access Denied.');
                setIsLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleManualSubmit = async () => {
        if (!manualLocation.state && !manualLocation.district) {
            setError('Please provide at least a district or use autocomplete.');
            return;
        }

        setIsLoading(true);
        try {
            let lat, lon;
            if (selectedCoords) {
                lat = selectedCoords.lat;
                lon = selectedCoords.lon;
            } else {
                const geoRes = await axios.get(`${API}/geocode`, { params: manualLocation });
                lat = geoRes.data.latitude;
                lon = geoRes.data.longitude;
            }

            const label = `${manualLocation.district || ''}${manualLocation.district && manualLocation.state ? ', ' : ''}${manualLocation.state || ''}`;
            await fetchAndDisplayWeather(lat, lon, label || 'Manual Location');
        } catch (err) {
            setError('Location not found.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAutocompleteSelect = ({ district, state, lat, lon }) => {
        setManualLocation({ district, state });
        setSelectedCoords({ lat, lon });
    };

    return (
        <div className="premium-card">
            <h3 className="text-sm font-black text-brand-text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
                <MapPin size={18} className="text-brand-primary" />
                Step 1 — Select Location
            </h3>

            <div className="flex gap-2 mb-6 p-1 bg-slate-50 border border-slate-100 rounded-2xl">
                <button
                    onClick={() => { setLocationMode('current'); setWeatherData(null); setError(''); }}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${locationMode === 'current' ? 'bg-white text-brand-primary shadow-premium border border-slate-100' : 'text-slate-400 hover:text-brand-primary'}`}
                >
                    Auto GPS
                </button>
                <button
                    onClick={() => { setLocationMode('manual'); setWeatherData(null); setError(''); }}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${locationMode === 'manual' ? 'bg-white text-brand-primary shadow-premium border border-slate-100' : 'text-slate-400 hover:text-brand-primary'}`}
                >
                    Manual Entry
                </button>
            </div>

            {!weatherData ? (
                <div className="space-y-5">
                    {locationMode === 'current' ? (
                        <button
                            onClick={handleAutoGPS}
                            disabled={isLoading}
                            className="w-full py-4 bg-brand-text-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-brand-dark transition-all active:scale-[0.98] disabled:opacity-70 shadow-premium"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Navigation size={16} className="transition-transform group-hover:rotate-12" />}
                            {isLoading ? 'Detecting...' : 'Detect My Location'}
                        </button>
                    ) : (
                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Smart Search</label>
                                <LocationSearch onSelect={handleAutocompleteSelect} />
                            </div>

                            <div className="flex items-center gap-4 py-2">
                                <div className="h-px bg-slate-100 flex-1"></div>
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Or edit manually</span>
                                <div className="h-px bg-slate-100 flex-1"></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">District</label>
                                    <input
                                        type="text"
                                        placeholder="Enter district"
                                        value={manualLocation.district}
                                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/30 outline-none focus:border-brand-primary focus:bg-white transition-all text-xs font-bold text-brand-text-primary placeholder:text-slate-300"
                                        onChange={(e) => {
                                            setManualLocation({ ...manualLocation, district: e.target.value });
                                            setSelectedCoords(null);
                                        }}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">State</label>
                                    <input
                                        type="text"
                                        placeholder="Enter state"
                                        value={manualLocation.state}
                                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/30 outline-none focus:border-brand-primary focus:bg-white transition-all text-xs font-bold text-brand-text-primary placeholder:text-slate-300"
                                        onChange={(e) => {
                                            setManualLocation({ ...manualLocation, state: e.target.value });
                                            setSelectedCoords(null);
                                        }}
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleManualSubmit}
                                disabled={isLoading}
                                className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-dark transition-all shadow-premium"
                            >
                                {isLoading ? <Loader2 className="animate-spin mx-auto" size={16} /> : 'Get Weather Data'}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="mt-4 bg-brand-text-primary rounded-[2rem] p-7 text-white relative overflow-hidden shadow-premium-hover">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/40 to-transparent opacity-60" />
                    <button
                        onClick={() => setWeatherData(null)}
                        className="absolute top-6 right-6 text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors z-10"
                    >
                        Change
                    </button>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Live Weather</p>
                        <p className="text-2xl font-black mb-6 tracking-tight">{locationLabel}</p>
                        <div className="flex items-end gap-6">
                            <span className="text-6xl font-black tracking-tighter">{Math.round(weatherData.temperature)}°<span className="text-2xl opacity-40 ml-1">C</span></span>
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2 space-y-1">
                                <p className="flex items-center gap-2"><span className="text-brand-primary">💧</span> {weatherData.humidity}% Humidity</p>
                                <p className="flex items-center gap-2"><span className="text-brand-primary">🌧️</span> {weatherData.rainfall}mm Rain</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="mt-5 p-4 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-3 border border-red-100">
                    <AlertCircle size={14} /> {error}
                </div>
            )}
        </div>
    );
};

export default LocationSelector;