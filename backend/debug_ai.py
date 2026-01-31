from services.ai_service import generate_vedic_chart_analysis
import os

print(f"Checking AI Service...")
try:
    analysis = generate_vedic_chart_analysis(
        "Test User",
        [
            {"name": "Sun", "sign": "Aries", "house": 1},
            {"name": "Moon", "sign": "Libra", "house": 7}
        ],
        {"nakshatra": {"name": "Ashwini"}, "ascendant": {"name": "Aries"}},
        lang="en"
    )
    print("Result:", analysis)
except Exception as e:
    print("Error:", e)
