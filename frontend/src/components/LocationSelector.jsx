import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Navigation, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const API = 'http://localhost:5005/api';

const LocationSelector = ({ onLocationSelect, loading }) => {
    const [locationMode, setLocationMode] = useState('current');
    const [manualLocation, setManualLocation] = useState({ state: '', district: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [locationLabel, setLocationLabel] = useState('');

    const fetchAndDisplayWeather = async (lat, lon, label = '') => {
        setIsLoading(true);
        setError('');
        try {
            const res = await axios.get(`${API}/weather`, { params: { lat, lon }, timeout: 15000 });
            setWeatherData(res.data);
            const resolvedCity = res.data.location?.city || label || 'Selected Location';
            setLocationLabel(resolvedCity);
            onLocationSelect({ lat, lon, weatherData: res.data, mode: locationMode });
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
        if (!manualLocation.state && !manualLocation.district) return;
        setIsLoading(true);
        try {
            const geoRes = await axios.get(`${API}/geocode`, { params: manualLocation });
            const { latitude, longitude } = geoRes.data;
            const label = `${manualLocation.district}, ${manualLocation.state}`;
            await fetchAndDisplayWeather(latitude, longitude, label);
        } catch (err) {
            setError('Location not found.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl p-6 border border-brand-green/10 shadow-lg">
            <h3 className="text-lg font-black text-brand-dark uppercase mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-brand-green" />
                Step 1 — Select Location
            </h3>

            <div className="flex gap-2 mb-5 p-1 bg-gray-100 rounded-2xl">
                <button
                    onClick={() => { setLocationMode('current'); setWeatherData(null); }}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold uppercase transition-all ${locationMode === 'current' ? 'bg-brand-green text-white' : 'text-gray-500'}`}
                >
                    Auto GPS
                </button>
                <button
                    onClick={() => { setLocationMode('manual'); setWeatherData(null); }}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold uppercase transition-all ${locationMode === 'manual' ? 'bg-brand-green text-white' : 'text-gray-500'}`}
                >
                    Manual Entry
                </button>
            </div>

            {!weatherData ? (
                <div className="space-y-4">
                    {locationMode === 'current' ? (
                        <button
                            onClick={handleAutoGPS}
                            disabled={isLoading}
                            className="w-full py-4 bg-brand-dark text-white rounded-xl font-bold uppercase flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : <Navigation size={18} />}
                            {isLoading ? 'Detecting...' : 'Detect My Location'}
                        </button>
                    ) : (
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="District"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none"
                                onChange={(e) => setManualLocation({ ...manualLocation, district: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="State"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none"
                                onChange={(e) => setManualLocation({ ...manualLocation, state: e.target.value })}
                            />
                            <button
                                onClick={handleManualSubmit}
                                disabled={isLoading}
                                className="w-full py-3.5 bg-brand-green text-white rounded-xl font-bold uppercase"
                            >
                                {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Get Weather Data'}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="mt-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-6 text-white relative">
                    <button
                        onClick={() => setWeatherData(null)}
                        className="absolute top-4 right-4 text-xs bg-white/20 px-2 py-1 rounded-lg"
                    >
                        Change
                    </button>
                    <p className="text-sm font-bold opacity-80 uppercase">Live Weather</p>
                    <p className="text-xl font-black mb-4">{locationLabel}</p>
                    <div className="flex items-center gap-4">
                        <span className="text-5xl font-black">{Math.round(weatherData.temperature)}°C</span>
                        <div className="text-sm opacity-90">
                            <p>💧 {weatherData.humidity}% Humidity</p>
                            <p>🌧️ {weatherData.rainfall}mm Rain</p>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2">
                    <AlertCircle size={14} /> {error}
                </div>
            )}
        </div>
    );
};

export default LocationSelector;