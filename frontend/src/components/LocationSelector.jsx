import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Navigation, Loader2, AlertCircle, Droplets, CloudRain } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import LocationSearch from './LocationSearch';

const getApiUrl = () => {
    const url = import.meta.env.VITE_API_URL || 'https://agroxai.onrender.com/api';
    return url.endsWith('/api') ? url : `${url}/api`;
};
const API = getApiUrl();

const LocationSelector = ({ onLocationSelect, loading }) => {
    const [locationMode, setLocationMode] = useState('current');
    const [manualLocation, setManualLocation] = useState({ state: '', district: '' });
    const [selectedCoords, setSelectedCoords] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [locationLabel, setLocationLabel] = useState('');

    const [searchParams] = useSearchParams();
    const hasAutoLoaded = React.useRef(false);

    useEffect(() => {
        const districtParam = searchParams.get('district');
        const stateParam = searchParams.get('state');
        if ((districtParam || stateParam) && !hasAutoLoaded.current) {
            hasAutoLoaded.current = true;
            setLocationMode('manual');
            const loc = { state: stateParam || '', district: districtParam || '' };
            setManualLocation(loc);

            if (districtParam || stateParam) {
                const autoFetch = async () => {
                    setIsLoading(true);
                    setError('');
                    try {
                        const geoRes = await axios.get(`${API}/geocode`, { params: loc });
                        const lat = geoRes.data.latitude;
                        const lon = geoRes.data.longitude;
                        const label = `${loc.district || ''}${loc.district && loc.state ? ', ' : ''}${loc.state || ''}`;
                        setSelectedCoords({ lat, lon });
                        await fetchAndDisplayWeather(lat, lon, label);
                    } catch (err) {
                        console.error('Auto location link failed:', err);
                    } finally {
                        setIsLoading(false);
                    }
                };
                autoFetch();
            }
        }
    }, [searchParams]);

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

            <div className="flex gap-2 mb-6 p-1 bg-brand-surface-inset border border-brand-border rounded-2xl">
                <button
                    onClick={() => { setLocationMode('current'); setWeatherData(null); setError(''); }}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${locationMode === 'current' ? 'bg-brand-surface-elevated text-brand-primary shadow-premium border border-brand-border' : 'text-brand-text-secondary hover:text-brand-primary'}`}
                >
                    Auto GPS
                </button>
                <button
                    onClick={() => { setLocationMode('manual'); setWeatherData(null); setError(''); }}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${locationMode === 'manual' ? 'bg-brand-surface-elevated text-brand-primary shadow-premium border border-brand-border' : 'text-brand-text-secondary hover:text-brand-primary'}`}
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
                            className="w-full py-4 bg-brand-primary text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-70 shadow-premium"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Navigation size={16} className="transition-transform group-hover:rotate-12" />}
                            {isLoading ? 'Detecting...' : 'Detect My Location'}
                        </button>
                    ) : (
                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">Smart Search</label>
                                <LocationSearch onSelect={handleAutocompleteSelect} />
                            </div>

                            <div className="flex items-center gap-4 py-2">
                                <div className="h-px bg-brand-border flex-1"></div>
                                <span className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">Or edit manually</span>
                                <div className="h-px bg-brand-border flex-1"></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">District</label>
                                    <input
                                        type="text"
                                        placeholder="Enter district"
                                        value={manualLocation.district}
                                        className="w-full px-4 py-3.5 rounded-xl border border-brand-border bg-brand-surface-inset outline-none focus:border-brand-primary focus:bg-brand-surface transition-all text-xs font-bold text-brand-text-primary placeholder:text-brand-text-secondary"
                                        onChange={(e) => {
                                            setManualLocation({ ...manualLocation, district: e.target.value });
                                            setSelectedCoords(null);
                                        }}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">State</label>
                                    <input
                                        type="text"
                                        placeholder="Enter state"
                                        value={manualLocation.state}
                                        className="w-full px-4 py-3.5 rounded-xl border border-brand-border bg-brand-surface-inset outline-none focus:border-brand-primary focus:bg-brand-surface transition-all text-xs font-bold text-brand-text-primary placeholder:text-brand-text-secondary"
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
                                className="w-full py-4 bg-brand-primary text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-premium"
                            >
                                {isLoading ? <Loader2 className="animate-spin mx-auto" size={16} /> : 'Get Weather Data'}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="mt-4 bg-gradient-to-br from-emerald-600 via-emerald-700 to-cyan-700 dark:from-brand-surface dark:via-brand-surface-inset dark:to-brand-surface-elevated border border-brand-border rounded-[2rem] p-7 text-white dark:text-brand-text-primary relative overflow-hidden shadow-premium-hover hover:scale-[1.01] transition-transform duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 dark:bg-brand-primary/10 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
                    <button
                        onClick={() => setWeatherData(null)}
                        className="absolute top-6 right-6 text-[10px] font-black uppercase tracking-widest bg-white/10 dark:bg-brand-surface-inset hover:bg-white/20 dark:hover:bg-brand-surface-hover px-3 py-1.5 rounded-lg border border-white/10 dark:border-brand-border transition-colors z-10 text-white dark:text-brand-text-primary"
                    >
                        Change
                    </button>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Live Weather</p>
                        <p className="text-2xl font-black mb-6 tracking-tight">{locationLabel}</p>
                        <div className="flex items-end gap-6">
                            <span className="text-6xl font-black tracking-tighter">{Math.round(weatherData.temperature)}°<span className="text-2xl opacity-40 ml-1">C</span></span>
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2 space-y-2">
                                <p className="flex items-center gap-2"><Droplets size={12} className="text-cyan-300 dark:text-brand-primary animate-pulse" /> {weatherData.humidity}% Humidity</p>
                                <p className="flex items-center gap-2"><CloudRain size={12} className="text-cyan-300 dark:text-brand-primary animate-bounce" /> {weatherData.rainfall}mm Rain</p>
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