
from generate_report import ReportGenerator
import json

def test_final_report():
    name = "Deepa Kumari"
    year, month, day = 1993, 11, 23
    hour, minute = 15, 30
    lat, lng = 24.1, 84.1 # Patan, Palamu
    city = "Patan"

    report = ReportGenerator.generate_consolidated_report(
        name, year, month, day, hour, minute, city, lat, lng
    )

    print("\n--- DOSHAS IN REPORT ---")
    doshas = report.get('vedic_astrology', {}).get('doshas', {})
    for k, v in doshas.items():
        if v.get('present'):
            print(f"{k.upper()}: {v['intensity']} - {v['reason']}")

    print("\n--- AI ANALYSIS DOSHA CHECK ---")
    pa = report.get('vedic_astrology', {}).get('vedic_personality_analysis', {})
    print(f"Manglik Status: {pa.get('manglik_status')}")
    print(f"Pitru Dosha Status: {pa.get('pitru_dosha_status')}")

if __name__ == "__main__":
    test_final_report()
