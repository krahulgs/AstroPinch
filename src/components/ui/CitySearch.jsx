import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';

const CitySearch = ({ onSelect, defaultValue = '' }) => {
    const [query, setQuery] = useState(defaultValue);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchCities = async () => {
            if (query.length < 3) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(
                    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
                );
                const data = await response.json();
                setResults(data.results || []);
                setIsOpen(true);
            } catch (error) {
                console.error("Failed to fetch cities:", error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            if (query !== defaultValue) {
                fetchCities();
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [query, defaultValue]);

    const handleSelect = (city) => {
        const locationString = `${city.name}, ${city.country}`;
        setQuery(locationString);
        setIsOpen(false);
        onSelect(city);
    };

    return (
        <div className="relative group" ref={wrapperRef}>
            <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-secondary group-focus-within:text-purple-600 transition-colors pointer-events-none" />
            <input
                type="text"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => query.length >= 3 && setIsOpen(true)}
                className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-10 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all text-primary placeholder:text-slate-400"
                placeholder="Search for your birth city..."
                required
            />

            {isLoading && (
                <Loader2 className="absolute right-4 top-3.5 w-5 h-5 text-secondary animate-spin" />
            )}

            {isOpen && results.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                    {results.map((city) => (
                        <button
                            key={city.id}
                            type="button"
                            onClick={() => handleSelect(city)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex flex-col border-b border-gray-50 last:border-0"
                        >
                            <span className="font-medium text-primary">{city.name}</span>
                            <span className="text-xs text-secondary">
                                {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CitySearch;
