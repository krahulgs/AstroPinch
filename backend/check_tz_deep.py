
from services.vedic_astro_engine import VedicAstroEngine

def check_tz_debug():
    # Test Timezone conversion logic by checking Ascendant (Lagna) which moves fast (1 sign/2 hours)
    
    # CASE 1: 18:20 UTC (11:50 PM India)
    d_utc = VedicAstroEngine.calculate_sidereal_planets(1976, 11, 12, 18, 20, 23.67, 86.15, timezone_str='UTC')
    asc_utc = d_utc['ascendant']
    moon_utc = next(p for p in d_utc['planets'] if p['name'] == 'Moon')
    
    # CASE 2: 18:20 IST (12:50 PM UTC) -> Should be ~5.5 hours earlier than Case 1
    d_ist = VedicAstroEngine.calculate_sidereal_planets(1976, 11, 12, 18, 20, 23.67, 86.15, timezone_str='Asia/Kolkata')
    asc_ist = d_ist['ascendant']
    moon_ist = next(p for p in d_ist['planets'] if p['name'] == 'Moon')
    
    print(f"CASE 1 (18:20 UTC, London): Asc: {asc_utc['longitude']:.2f} ({asc_utc['sign']}), Moon: {moon_utc['sidereal_longitude']:.2f} ({moon_utc['sign']})")
    print(f"CASE 2 (18:20 IST, Bokaro): Asc: {asc_ist['longitude']:.2f} ({asc_ist['sign']}), Moon: {moon_ist['sidereal_longitude']:.2f} ({moon_ist['sign']})")
    
    # Calculate difference
    diff_moon = abs(moon_utc['sidereal_longitude'] - moon_ist['sidereal_longitude'])
    diff_asc = abs(asc_utc['longitude'] - asc_ist['longitude'])
    
    # Ascendant moves ~360 deg in 24h => 15 deg/hr => 5.5h should be ~82.5 deg diff.
    # Moon moves ~13 deg in 24h => 0.5 deg/hr => 5.5h should be ~3 deg diff.
    
    print(f"Moon Diff: {diff_move(diff_moon):.2f} (Expected ~3.0)")
    print(f"Asc Diff: {diff_move(diff_asc):.2f} (Expected ~82.5)")

def diff_move(val):
    return min(val, 360-val)

if __name__ == "__main__":
    check_tz_debug()
