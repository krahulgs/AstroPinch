
from services.dosha_calculator import DoshaCalculator
from services.vedic_astro_engine import VedicAstroEngine

# Deepa Kumari
# 30 Sept 2004, 19:03, Palamu, Jharkhand, India
# Lat: 24.03N, Lng: 84.07E (Approx for Patan/Palamu)

def test_kaal_sarp():
    print("Testing Deepa Kumari Kaal Sarp Status...")
    lat = 24.03
    lng = 84.07
    
    sid_data = VedicAstroEngine.calculate_sidereal_planets(
        2004, 9, 30, 19, 3, lat, lng, timezone_str="Asia/Kolkata"
    )
    
    rahu = next(p for p in sid_data['planets'] if p['name'] == 'Rahu')
    ketu = next(p for p in sid_data['planets'] if p['name'] == 'Ketu')
    
    print(f"Rahu: {rahu['sidereal_longitude']:.2f} ({rahu['sign']})")
    print(f"Ketu: {ketu['sidereal_longitude']:.2f} ({ketu['sign']})")
    
    print("\n--- PLANETARY POSITIONS ---")
    planets = [p for p in sid_data['planets'] if p['name'] not in ['Rahu', 'Ketu', 'Uranus', 'Neptune', 'Pluto', 'Ascendant']]
    
    for p in planets:
        print(f"{p['name']}: {p['sidereal_longitude']:.2f} ({p['sign']})")
        
    doshas = DoshaCalculator.calculate_doshas(sid_data)
    
    print(f"\n--- KAAL SARP RESULT ---")
    print(f"Present: {doshas['kaal_sarp']['present']}")
    print(f"Intensity: {doshas['kaal_sarp']['intensity']}")
    print(f"Reason: {doshas['kaal_sarp']['reason']}")

if __name__ == "__main__":
    test_kaal_sarp()
