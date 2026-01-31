from services.ai_service import generate_career_analysis
import os

print(f"Checking AI Service for Career Analysis...")
try:
    analysis = generate_career_analysis(
        "Test User",
        [
            {"name": "Sun", "sign": "Aries", "house": 10},
            {"name": "Saturn", "sign": "Capricorn", "house": 11}
        ],
        {"nakshatra": {"name": "Ashwini"}, "ascendant": {"name": "Cancer"}},
        lang="en"
    )
    print("Result:", analysis)
except Exception as e:
    print("Error:", e)
