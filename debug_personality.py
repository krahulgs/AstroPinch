
import sys
import os

# Add backend to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

try:
    from services.ai_service import generate_vedic_chart_analysis
    print("Import successful")
    
    # Mock data
    name = "Test User"
    planets = [
        {"name": "Sun", "sign": "Aries", "house": 1},
        {"name": "Moon", "sign": "Taurus", "house": 2}
    ]
    panchang = {
        "nakshatra": {"name": "Ashwini"},
        "ascendant": {"name": "Aries"}
    }
    doshas = {"manglik": {"present": False}}
    
    print("Testing generate_vedic_chart_analysis...")
    result = generate_vedic_chart_analysis(name, planets, panchang, doshas=doshas)
    print("Result generated")
    
    with open('debug_result.json', 'w') as f:
        json.dump(result, f, indent=4)
    print("Result saved to debug_result.json")

except Exception as e:
    import traceback
    print(f"Error occurred: {e}")
    traceback.print_exc()
