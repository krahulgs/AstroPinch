"""
Direct KP test - runs from backend/ directory
Usage: cd backend && python test_kp_direct.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("=== KP Direct Test ===")

# Test params
year, month, day, hour, minute = 1995, 8, 15, 14, 30
lat, lng = 28.6139, 77.2090
timezone = 'Asia/Kolkata'
name = 'TestUser'

print(f"Birth: {day}/{month}/{year} {hour}:{minute} | Lat:{lat} Lng:{lng}")
print()

# Step 1: Sidereal data
from services.vedic_astro_engine import VedicAstroEngine
print("Step 1: calculate_sidereal_planets...")
sidereal_data = VedicAstroEngine.calculate_sidereal_planets(
    year, month, day, hour, minute, lat, lng, timezone_str=timezone
)
print(f"  ayanamsa = {sidereal_data['ayanamsa']} (type: {type(sidereal_data['ayanamsa']).__name__})")
print(f"  ascendant = {sidereal_data['ascendant']}")
print()

# Step 2: SkyfieldService angles
import datetime as _dt
import pytz as _pytz
print("Step 2: SkyfieldService.calculate_angles (UTC)...")
try:
    tz = _pytz.timezone(timezone)
    local_dt = tz.localize(_dt.datetime(year, month, day, hour, minute))
    utc_dt = local_dt.astimezone(_pytz.UTC)
    u_yr, u_mo, u_da, u_hr, u_mi = utc_dt.year, utc_dt.month, utc_dt.day, utc_dt.hour, utc_dt.minute
    print(f"  Local: {year}-{month}-{day} {hour}:{minute} IST")
    print(f"  UTC:   {u_yr}-{u_mo}-{u_da} {u_hr}:{u_mi}")

    from services.skyfield_engine import SkyfieldService
    angles = SkyfieldService.calculate_angles(u_yr, u_mo, u_da, u_hr, u_mi, lat, lng, timezone_str='UTC')
    print(f"  Ascendant (tropical) = {angles.get('Ascendant')}")
    print(f"  Midheaven = {angles.get('Midheaven')}")
    print(f"  IC = {angles.get('IC')}")
    print(f"  Descendant = {angles.get('Descendant')}")
except Exception as e:
    print(f"  ERROR: {e}")
    import traceback; traceback.print_exc()
print()

# Step 3: KP cusps
print("Step 3: calculate_kp_cusps...")
try:
    ayanamsa = sidereal_data['ayanamsa']
    asc = angles.get('Ascendant', 0)
    mc  = angles.get('Midheaven', 0)
    ic  = angles.get('IC', 0)
    dc  = angles.get('Descendant', 0)
    tropical_cusps_map = {
        "1": asc, "2": (asc+30)%360, "3": (asc+60)%360,
        "4": ic,  "5": (asc+120)%360, "6": (asc+150)%360,
        "7": dc,  "8": (asc+210)%360, "9": (asc+240)%360,
        "10": mc, "11": (asc+300)%360, "12": (asc+330)%360,
    }
    kp_cusps = VedicAstroEngine.calculate_kp_cusps(tropical_cusps_map, ayanamsa)
    print(f"  kp_cusps count: {len(kp_cusps)}")
    for h, v in sorted(kp_cusps.items(), key=lambda x: int(x[0])):
        print(f"  House {h}: {v.get('sign')} | Star:{v.get('star_lord')} | Sub:{v.get('sub_lord')}")
except Exception as e:
    print(f"  ERROR: {e}")
    import traceback; traceback.print_exc()
print()

# Step 4: KP Predictions
print("Step 4: KPPredictionService.generate_event_predictions...")
try:
    from services.kp_prediction_service import KPPredictionService
    kp_system = VedicAstroEngine.calculate_kp_system(sidereal_data)
    dasha = VedicAstroEngine.calculate_vimshottari_dasha(year, month, day, hour, minute, lat, lng, timezone_str=timezone)
    result = KPPredictionService.generate_event_predictions(kp_cusps, kp_system, dasha, lang='en', age=30)
    preds = result.get('predictions', [])
    print(f"  Predictions count: {len(preds)}")
    for p in preds:
        print(f"  {p['event']}: {p['outcome']} ({p['confidence']})")
except Exception as e:
    print(f"  ERROR: {e}")
    import traceback; traceback.print_exc()
print()

# Step 5: Full get_vedic_full_report
print("Step 5: AstrologyAggregator.get_vedic_full_report (async)...")
import asyncio
async def test_full():
    from services.astrology_aggregator import AstrologyAggregator
    result = await AstrologyAggregator.get_vedic_full_report(
        name, year, month, day, hour, minute, lat, lng,
        lang='en', timezone=timezone
    )
    kp_cusps = result.get('kp_cusps', {})
    print(f"  kp_cusps from full report: {len(kp_cusps)} houses")
    print(f"  kp_cusps is falsy: {not kp_cusps}")
    return result

result = asyncio.run(test_full())
print()
print("=== Done ===")
