import React, { createContext, useContext, useState } from 'react';
import { API_BASE_URL } from '../api/config';

const ChartContext = createContext();

export const useChart = () => useContext(ChartContext);

export const ChartProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [chartSvg, setChartSvg] = useState(null);
    const [lunarSvg, setLunarSvg] = useState(null);
    const [kundaliSvg, setKundaliSvg] = useState(null);
    const [chartAnalysis, setChartAnalysis] = useState(null);
    const [bestPrediction, setBestPrediction] = useState(null);
    const [numerologyData, setNumerologyData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const saveUserData = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const [year, month, day] = data.date.split('-').map(Number);
            const [hour, minute] = data.time.split(':').map(Number);

            // Basic validation
            if (!data.lat || !data.lng) {
                console.error("Missing location data");
                setError("Please select a city from the list.");
                setLoading(false);
                return false;
            }

            const payload = {
                name: data.name,
                year,
                month,
                day,
                hour,
                minute,
                city: data.place,
                lat: data.lat,
                lng: data.lng,
                timezone: data.timezone || "UTC",
                profession: data.profession,
                marital_status: data.marital_status
            };

            // Fetch all data in parallel
            const [dataRes, svgRes, lunarRes, kundaliRes, analysisRes, predRes, numRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/chart`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                }),
                fetch(`${API_BASE_URL}/api/chart/svg`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                }),
                fetch(`${API_BASE_URL}/api/chart/svg/lunar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                }),
                fetch(`${API_BASE_URL}/api/chart/svg/kundali`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                }),
                fetch(`${API_BASE_URL}/api/chart/analysis`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                }),
                fetch(`${API_BASE_URL}/api/predictions/best`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                }),
                fetch(`${API_BASE_URL}/api/numerology`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                })
            ]);

            if (!dataRes.ok || !svgRes.ok || !lunarRes.ok || !kundaliRes.ok || !analysisRes.ok || !predRes.ok || !numRes.ok) {
                throw new Error('Failed to fetch genealogical data');
            }

            const result = await dataRes.json();
            const svgResult = await svgRes.json();
            const lunarResult = await lunarRes.json();
            const kundaliResult = await kundaliRes.json();
            const analysisResult = await analysisRes.json();
            const predResult = await predRes.json();
            const numResult = await numRes.json();

            setChartData(result);
            setChartSvg(svgResult.svg);
            setLunarSvg(lunarResult.svg);
            setKundaliSvg(kundaliResult.svg);
            setChartAnalysis(analysisResult);
            setBestPrediction(predResult);
            setNumerologyData(numResult);
            setUserData(data);
            setLoading(false);
            return true;
        } catch (error) {
            console.error("Failed to fetch chart data:", error);
            setError("Failed to connect to the server. Please ensure the backend is running.");
            setLoading(false);
            return false;
        }
    };

    return (
        <ChartContext.Provider value={{ userData, chartData, chartSvg, lunarSvg, kundaliSvg, chartAnalysis, bestPrediction, numerologyData, saveUserData, loading, error }}>
            {children}
        </ChartContext.Provider>
    );
};
