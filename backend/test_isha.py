
from generate_report import ReportGenerator
import json

def test_isha_report():
    name = "Isha Kumari"
    year, month, day = 2001, 8, 31
    hour, minute = 11, 5
    lat, lng = 23.7957, 86.4304 # Dhanbad
    city = "Dhanbad"

    report = ReportGenerator.generate_consolidated_report(
        name, year, month, day, hour, minute, city, lat, lng
    )

    print("\n--- DOSHAS FOR ISHA ---")
    doshas = report.get('vedic_astrology', {}).get('doshas', {})
    for k, v in doshas.items():
        if v.get('present'):
            print(f"{k.upper()}: {v['intensity']} - {v['reason']}")

    pa = report.get('vedic_astrology', {}).get('vedic_personality_analysis', {})
    print(f"\nPitru Status in AI: {pa.get('pitru_dosha_status')}")

if __name__ == "__main__":
    test_isha_report()
