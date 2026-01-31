import os
import sys

# Add the current directory to sys.path
sys.path.append(os.getcwd())

from services.numerology_service import get_numerology_data

def test_comparison():
    print("Testing Profile Comparison...")
    
    profiles = [
        {"name": "Albert Einstein", "year": 1879, "month": 3, "day": 14},
        {"name": "Marie Curie", "year": 1867, "month": 11, "day": 7}
    ]
    
    results = []
    for p in profiles:
        print(f"\nProcessing {p['name']}...")
        data = get_numerology_data(p['name'], p['year'], p['month'], p['day'])
        results.append(data)
        
    print("\n--- COMPARISON ---")
    for i, r in enumerate(results):
        print(f"\nProfile {i+1}: {r['name']}")
        print(f"Birth Date: {r['birth_date']}")
        print(f"Fadic Number: {r['science_of_success']['fadic_number']}")
        if 'ai_insights' in r:
            print(f"AI Insights (first 100 chars): {r['ai_insights'][:100]}...")
        else:
            print("❌ No AI Insights found.")

    if len(results) == 2:
        if results[0].get('ai_insights') == results[1].get('ai_insights'):
            print("\n🚨 WARNING: AI INSIGHTS ARE IDENTICAL!")
        else:
            print("\n✅ SUCCESS: AI INSIGHTS ARE DIFFERENT.")

if __name__ == "__main__":
    test_comparison()
