import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { indianCities } from '../../data/indianCities';

const CitySearch = ({ onSelect, defaultValue = '', inputRef }) => {
    const [query, setQuery] = useState(defaultValue);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    const popularCities = indianCities.slice(0, 50);

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
            if (query.length < 2) {
                setResults([]);
                return;
            }

            // Local search in indianCities dataset for faster response
            const localResults = indianCities
                .filter(city =>
                    city.name.toLowerCase().includes(query.toLowerCase()) ||
                    city.admin1.toLowerCase().includes(query.toLowerCase())
                )
                .sort((a, b) => {
                    // Exact match on name gets highest priority
                    const aExact = a.name.toLowerCase() === query.toLowerCase();
                    const bExact = b.name.toLowerCase() === query.toLowerCase();
                    if (aExact && !bExact) return -1;
                    if (!aExact && bExact) return 1;

                    // Starts with query gets second priority
                    const aStarts = a.name.toLowerCase().startsWith(query.toLowerCase());
                    const bStarts = b.name.toLowerCase().startsWith(query.toLowerCase());
                    if (aStarts && !bStarts) return -1;
                    if (!aStarts && bStarts) return 1;

                    return 0;
                })
                .slice(0, 15);

            if (localResults.length > 0) {
                setResults(localResults);
                setIsOpen(true);
            }

            setIsLoading(true);
            try {
                // Remove the India-only bias. Let users search globally.
                const searchQuery = query;
                const response = await fetch(
                    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=20&language=en&format=json`
                );
                const data = await response.json();

                const apiResults = data.results ? data.results.map(city => ({
                    id: city.id,
                    name: city.name,
                    admin1: city.admin1,
                    country: city.country,
                    latitude: city.latitude,
                    longitude: city.longitude,
                    timezone: city.timezone || "UTC" // Dynamic timezone
                })) : [];

                // Merge and filter
                const merged = [...localResults];
                apiResults.forEach(apiCity => {
                    if (!merged.find(c => c.name.toLowerCase() === apiCity.name.toLowerCase() && c.admin1?.toLowerCase() === apiCity.admin1?.toLowerCase())) {
                        merged.push(apiCity);
                    }
                });

                // Prioritize requested countries: India (legacy), USA, UK, UAE, Canada, Australia
                const priorityCountries = ['India', 'United States', 'United Kingdom', 'United Arab Emirates', 'Canada', 'Australia'];

                setResults(merged.sort((a, b) => {
                    const aPriority = priorityCountries.indexOf(a.country);
                    const bPriority = priorityCountries.indexOf(b.country);

                    if (aPriority !== -1 && bPriority === -1) return -1;
                    if (aPriority === -1 && bPriority !== -1) return 1;
                    if (aPriority !== -1 && bPriority !== -1) return aPriority - bPriority;

                    // Priority for cities in our local high-accuracy list
                    const aIsLocal = indianCities.some(lc => lc.name === a.name);
                    const bIsLocal = indianCities.some(lc => lc.name === b.name);
                    if (aIsLocal && !bIsLocal) return -1;
                    if (!aIsLocal && bIsLocal) return 1;

                    return 0;
                }).slice(0, 20));

                setIsOpen(true);
            } catch (error) {
                console.error("Failed to fetch cities:", error);
                // Fallback to what we have or empty
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            if (query !== defaultValue && query.length >= 2) {
                fetchCities();
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, defaultValue]);

    const handleSelect = (city) => {
        const locationString = `${city.name}, ${city.country}`;
        setQuery(locationString);
        setIsOpen(false);
        onSelect(city);
    };

    const displayResults = query.length < 2 ? popularCities : results;

    return (
        <div className="relative group" ref={wrapperRef}>
            <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-secondary group-focus-within:text-purple-600 transition-colors pointer-events-none" />
            <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                    const filteredVal = e.target.value.replace(/[^a-zA-Z\s,]/g, ''); // Allow comma for "City, Country" selection but primary focus is letters
                    setQuery(filteredVal);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-10 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all text-primary placeholder:text-slate-400"
                placeholder="Enter Place of Birth"
                required
            />

            {isLoading && (
                <div className="absolute right-4 top-3.5 flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 animate-pulse">Searching Districts...</span>
                    <Loader2 className="w-4 h-4 text-secondary animate-spin" />
                </div>
            )}

            {isOpen && displayResults.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                        <span>{query.length < 2 ? "Popular Indian Cities" : "Search Results"}</span>
                        {query.length > 0 && <span className="text-purple-500">Found {displayResults.length} places</span>}
                    </div>

                    {displayResults.map((city) => (
                        <button
                            key={city.id || `${city.latitude}-${city.longitude}-${city.name}`}
                            type="button"
                            onClick={() => handleSelect(city)}
                            className="w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors flex flex-col border-b border-gray-50 last:border-0 group/item"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-primary group-hover/item:text-purple-700">{city.name}</span>
                                {city.country === 'India' && <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded border border-green-100 uppercase font-bold">Local</span>}
                            </div>
                            <span className="text-xs text-secondary italic">
                                {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                            </span>
                        </button>
                    ))}

                    {query.length < 2 && (
                        <div className="p-4 text-center bg-purple-50/50">
                            <p className="text-xs text-purple-600 font-medium italic">
                                💡 Type 2+ characters to find any specific District or Taluka in India
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CitySearch;
