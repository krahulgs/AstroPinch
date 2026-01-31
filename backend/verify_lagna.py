from services.vedic_astro_engine import VedicAstroEngine
import json

def test_chart_houses():
    # Example: Rahul (Hypothetical)
    # Using a fixed date/time for consistency checking
    year, month, day = 1990, 1, 1
    hour, minute = 12, 0
    lat, lng = 28.6139, 77.2090 # New Delhi
    
    # Calculate
    data = VedicAstroEngine.calculate_sidereal_planets(year, month, day, hour, minute, lat, lng)
    
    print(f"Calculated Ayanamsa: {data.get('ayanamsa')}")
    print(f"Ascendant (Lagna): {data.get('ascendant')}")
    
    asc_sign = data['ascendant']['sign']
    asc_sign_id = data['ascendant']['sign_id']
    
    print("-" * 20)
    print("Planetary Positions (Sidereal Whole Sign)")
    print("-" * 20)
    
    signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
    
    for p in data['planets']:
        p_name = p['name']
        p_sign = p['sign']
        p_house = p['house']
        
        # Verify Manual Logic
        p_sign_idx = signs.index(p_sign)
        expected_house = (p_sign_idx - (asc_sign_id - 1)) % 12 + 1
        
        status = "OK" if p_house == expected_house else f"FAIL (Expected {expected_house})"
        print(f"{p_name:10} | Sign: {p_sign:12} | House: {p_house} | Check: {status}")

if __name__ == "__main__":
    test_chart_houses()
