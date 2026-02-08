
from services.vedic_astro_engine import VedicAstroEngine

def check():
    # Attempt 2: Timezone offset manually (If UTC was passed)
    # The user says "6:20 PM". If they input this as "18:20" and selected "Asia/Kolkata", 
    # our backend converts it to UTC: 18:20 - 5:30 = 12:50 UTC.
    # Skyfield takes this UTC time.
    
    # Check what happens if we pass 'UTC' but keep 18:20 (Simulating Double Conversion error or wrong assumption)
    d_utc = VedicAstroEngine.calculate_sidereal_planets(1976, 11, 12, 18, 20, 23.67, 86.15, timezone_str='UTC')
    s_utc = next(p for p in d_utc['planets'] if p['name'] == 'Sun')
    print(f"If 18:20 was UTC -> Sun: {s_utc['sidereal_longitude']} ({s_utc['sign']})")
    
    # Normal Correct flow
    d_ist = VedicAstroEngine.calculate_sidereal_planets(1976, 11, 12, 18, 20, 23.67, 86.15, timezone_str='Asia/Kolkata')
    s_ist = next(p for p in d_ist['planets'] if p['name'] == 'Sun')
    print(f"If 18:20 was IST -> Sun: {s_ist['sidereal_longitude']} ({s_ist['sign']})")

if __name__ == "__main__":
    check()
