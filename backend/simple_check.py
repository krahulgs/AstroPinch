
from services.vedic_astro_engine import VedicAstroEngine

def check():
    d = VedicAstroEngine.calculate_sidereal_planets(1976, 11, 12, 18, 20, 23.67, 86.15, timezone_str='Asia/Kolkata')
    s = next(p for p in d['planets'] if p['name'] == 'Sun')
    r = next(p for p in d['planets'] if p['name'] == 'Rahu')
    print(f"Sun: {s['sidereal_longitude']} ({s['sign']})")
    print(f"Rahu: {r['sidereal_longitude']} ({r['sign']})")

if __name__ == "__main__":
    check()
