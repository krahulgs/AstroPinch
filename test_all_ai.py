import os
import sys
from datetime import datetime

# Add the current directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

from backend.generate_report import ReportGenerator

def test_full_ai_differentiation():
    profiles = [
        {
            "name": "John Lennon",
            "year": 1940, "month": 10, "day": 9, "hour": 18, "minute": 30,
            "city": "Liverpool, UK", "lat": 53.4, "lng": -2.9, "timezone": 1.0
        },
        {
            "name": "Bill Gates",
            "year": 1955, "month": 10, "day": 28, "hour": 22, "minute": 00,
            "city": "Seattle, USA", "lat": 47.6, "lng": -122.3, "timezone": -7.0
        }
    ]

    results = []
    
    for p in profiles:
        print(f"\n--- Generating Full Report for {p['name']} ---")
        report = ReportGenerator.generate_consolidated_report(
            p['name'], p['year'], p['month'], p['day'], p['hour'], p['minute'],
            p['city'], p['lat'], p['lng'], p['timezone']
        )
        
        results.append({
            "name": p['name'],
            "summary": report.get('best_prediction', {}).get('best_prediction', ''),
            "western": report.get('western_chart', {}).get('ai_summary', ''),
            "vedic": report.get('vedic_astrology', {}).get('ai_summary', '')
        })

    # Compare
    print("\n" + "="*50)
    print("AI DIFFERENTIATION RESULTS")
    print("="*50)
    
    for key in ['summary', 'western', 'vedic']:
        text1 = results[0][key] or ""
        text2 = results[1][key] or ""
        
        print(f"\nSECTION: {key.upper()}")
        print(f"Profile 1 Length: {len(text1)}")
        print(f"Profile 2 Length: {len(text2)}")
        
        if not text1 or not text2:
            print("⚠️ WARNING: One or both reports returned empty/None for this section.")
            # Debug: Print the report keys to see what we have
            print(f"DEBUG: Results 0 keys for {key}: {results[0].keys()}")
            continue

        if text1 == text2:
            print("❌ FAILURE: Text is identical!")
        else:
            print("✅ SUCCESS: Text is different.")
            # Print first 200 chars of each to verify tone
            print(f"P1 Preview: {text1[:200]}...")
            print(f"P2 Preview: {text2[:200]}...")

if __name__ == "__main__":
    test_full_ai_differentiation()
