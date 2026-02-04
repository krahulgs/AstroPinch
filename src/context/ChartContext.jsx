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
    const [consolidatedReport, setConsolidatedReport] = useState(null);
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

            // Optimization: Fetch only the consolidated report instead of 7 parallel requests
            // This is much safer for Render Free Tier to avoid overloading the single worker instance.
            const response = await fetch(`${API_BASE_URL}/api/report/consolidated`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to generate consolidated report');
            }

            const report = await response.json();

            // Map the consolidated report data to context fields for compatibility
            setConsolidatedReport(report);
            setNumerologyData(report.numerology);
            setChartData(report.western_astrology);
            setKundaliSvg(report.vedic_astrology?.chart_svg);
            setChartAnalysis(report.vedic_astrology?.kundali_analysis);
            setBestPrediction(report.predictions_summary);

            // Note: SVG/Lunar might need separate fetches if not in consolidated, 
            // but we can fetch them lazily in components or add them to the report.

            setUserData(data);
            setLoading(false);
            return report;
        } catch (error) {
            console.error("Failed to fetch chart data:", error);
            setError("The server is taking too long to respond. Please try again or check your connection.");
            setLoading(false);
            return false;
        }
    };

    return (
        <ChartContext.Provider value={{
            userData,
            chartData,
            chartSvg,
            lunarSvg,
            kundaliSvg,
            chartAnalysis,
            bestPrediction,
            numerologyData,
            consolidatedReport,
            saveUserData,
            loading,
            error
        }}>
            {children}
        </ChartContext.Provider>
    );
};
