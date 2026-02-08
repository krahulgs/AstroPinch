
from services.dosha_calculator import DoshaCalculator
from services.vedic_astro_engine import VedicAstroEngine

# Anju Kumari
# 23 Dec 1993, 12:18 PM, Dhanbad, Jharkhand, India
# Lat/Lng: Dhanbad approx 23.79N, 86.43E

def test_anju_manglik():
    print("Testing Anju Kumari Manglik Status...")
    
    # Coordinates for Dhanbad (approx)
    lat = 23.7957
    lng = 86.4304
    
    sid_data = VedicAstroEngine.calculate_sidereal_planets(
        1993, 12, 23, 12, 18, lat, lng, timezone_str="Asia/Kolkata"
    )
    
    asc = sid_data['ascendant']
    mars = next(p for p in sid_data['planets'] if p['name'] == 'Mars')
    moon = next(p for p in sid_data['planets'] if p['name'] == 'Moon')
    
    print(f"\n--- POSITIONS ---")
    print(f"Ascendant: {asc['longitude']:.2f} ({asc['sign']})")
    print(f"Mars: {mars['sidereal_longitude']:.2f} ({mars['sign']}), House: {mars['house']}")
    print(f"Moon: {moon['sidereal_longitude']:.2f} ({moon['sign']}), House: {moon['house']}")
    
    # Manual Manglik Check
    print(f"\n--- MANGLIK ANALYSIS ---")
    print(f"Mars House from Lagna: {mars['house']}")
    
    mars_from_moon = (mars['house'] - moon['house']) % 12 + 1
    print(f"Mars House from Moon: {mars_from_moon}")
    
    doshas = DoshaCalculator.calculate_doshas(sid_data)
    
    print(f"\n--- FINAL RESULT ---")
    print(f"Manglik Present: {doshas['manglik']['present']}")
    print(f"Manglik Intensity: {doshas['manglik']['intensity']}")
    print(f"Reason: {doshas['manglik']['reason']}")

if __name__ == "__main__":
    test_anju_manglik()
