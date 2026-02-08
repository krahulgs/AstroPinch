
from services.dosha_calculator import DoshaCalculator
from services.vedic_astro_engine import VedicAstroEngine

# Rahul Kumar
# 12 Nov 1976, 18:20, Bokaro (23.67, 86.15)
# Expected: Sun ~206.98 (Libra), Rahu ~188.89 (Libra). Dist ~18.09 deg.
# Grahan Limit: 12 deg. Pitru Limit: 15 deg.
# Result Expected: Grahan=False, Pitru=False (unless other reasons)

def test_rahul_dosha():
    print("Testing Rahul Kumar Dosha with NEW logic...")
    
    # We can mock the sidereal data directly or calculate it
    # Let's calculate it to be integration-test compliant
    # Timezone: UTC conversion: 18:20 IST -> 12:50 UTC
    
    # Using explicit UTC to ensure we get the same values as standard
    sid_data = VedicAstroEngine.calculate_sidereal_planets(
        1976, 11, 12, 18, 20, 23.67, 86.15, timezone_str="Asia/Kolkata"
    )
    
    sun = next(p for p in sid_data['planets'] if p['name'] == 'Sun')
    rahu = next(p for p in sid_data['planets'] if p['name'] == 'Rahu')
    mars = next(p for p in sid_data['planets'] if p['name'] == 'Mars')
    moon = next(p for p in sid_data['planets'] if p['name'] == 'Moon')
    jupiter = next(p for p in sid_data['planets'] if p['name'] == 'Jupiter')
    
    print(f"Sun: {sun['sidereal_longitude']} ({sun['sign']}), House: {sun['house']}")
    print(f"Rahu: {rahu['sidereal_longitude']} ({rahu['sign']}), House: {rahu['house']}")
    print(f"Mars: {mars['sidereal_longitude']} ({mars['sign']}), House: {mars['house']}")
    print(f"Moon: {moon['sidereal_longitude']} ({moon['sign']}), House: {moon['house']}")
    print(f"Jupiter: {jupiter['sidereal_longitude']} ({jupiter['sign']}), House: {jupiter['house']}")
    
    dist = abs(sun['sidereal_longitude'] - rahu['sidereal_longitude'])
    print(f"Sun-Rahu Distance: {dist} deg")
    
    # Debug Manglik Logic Manual Check
    # From Lagna
    print(f"Mars House from Lagna: {mars['house']}")
    # From Moon
    # House = (MarsHouse - MoonHouse) % 12 + 1
    # Note: Logic assumes House numbers are correct relative to Asc
    mars_from_moon = (mars['house'] - moon['house']) % 12 + 1
    print(f"Mars House from Moon: {mars_from_moon}")
    
    doshas = DoshaCalculator.calculate_doshas(sid_data)
    
    print("\n--- DOSHA RESULTS ---")
    print(f"Grahan Dosha: {doshas['grahan_dosha']['present']}")
    print(f"Pitru Dosha: {doshas['pitru_dosha']['present']}")
    print(f"Manglik Dosha: {doshas['manglik']['present']}")
    print(f"Manglik Reason: {doshas['manglik']['reason']}")
    
    if doshas['grahan_dosha']['present']:
        print("FAIL: Grahan Dosha should be Absent (dist > 12)")
    else:
        print("SUCCESS: Grahan Dosha is Absent")

if __name__ == "__main__":
    test_rahul_dosha()
