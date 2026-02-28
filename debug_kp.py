import sys
sys.path.insert(0, 'backend')
os_import = __import__('os')
os_import.chdir('backend')

from services.vedic_astro_engine import VedicAstroEngine
from services.kerykeion_engine import KerykeionService
from services.kp_prediction_service import KPPredictionService

year, month, day, hour, minute = 1995, 7, 15, 10, 30
lat, lng = 28.6139, 77.2090
timezone = 'Asia/Kolkata'
name = 'Test'

print('=== Testing sidereal_data ===')
sidereal = VedicAstroEngine.calculate_sidereal_planets(year, month, day, hour, minute, lat, lng, timezone_str=timezone)
print('ayanamsa type:', type(sidereal['ayanamsa']), 'value:', sidereal['ayanamsa'])
print('ascendant:', sidereal['ascendant'])

print()
print('=== Testing KerykeionService ===')
try:
    kery = KerykeionService.calculate_chart(name, year, month, day, hour, minute, '', lat, lng, timezone_str=timezone)
    print('kery_data:', type(kery))
    if kery:
        print('angles:', kery.get('angles'))
    else:
        print('kery_data is None/empty!')
except Exception as e:
    print('Kerykeion ERROR:', e)
    import traceback
    traceback.print_exc()

print()
print('=== Testing KP Cusps directly ===')
try:
    ayanamsa = sidereal['ayanamsa']
    asc = sidereal['ascendant']['longitude']
    # Direct equal-house cusps from sidereal asc
    # But we need TROPICAL asc for kp_cusps
    from services.skyfield_engine import SkyfieldService
    import pytz, datetime
    tz = pytz.timezone(timezone)
    local_dt = tz.localize(datetime.datetime(year, month, day, hour, minute))
    utc_dt = local_dt.astimezone(pytz.UTC)
    angles = SkyfieldService.calculate_angles(utc_dt.year, utc_dt.month, utc_dt.day, utc_dt.hour, utc_dt.minute, lat, lng, timezone_str='UTC')
    print('Skyfield angles:', angles)
    tropical_asc = angles.get('Ascendant', 0)
    cusps_map = {
        "1": tropical_asc,
        "4": (tropical_asc + 90) % 360,
        "7": (tropical_asc + 180) % 360,
        "10": (tropical_asc + 270) % 360,
    }
    kp_cusps = VedicAstroEngine.calculate_kp_cusps(cusps_map, ayanamsa)
    print('KP Cusps result:', kp_cusps)
    print('KP Cusps count:', len(kp_cusps))
except Exception as e:
    print('Direct KP ERROR:', e)
    import traceback
    traceback.print_exc()

print()
print('=== Testing KPPredictionService ===')
try:
    kp_system = VedicAstroEngine.calculate_kp_system(sidereal)
    dasha = VedicAstroEngine.calculate_vimshottari_dasha(year, month, day, hour, minute, lat, lng, timezone_str=timezone)
    
    # Use a minimal cusps
    cusps_map = {"1": 100.0, "4": 190.0, "7": 280.0, "10": 10.0}
    kp_cusps = VedicAstroEngine.calculate_kp_cusps(cusps_map, sidereal['ayanamsa'])
    print('kp_cusps sample:', {k: v.get('sub_lord') for k,v in kp_cusps.items()})
    
    result = KPPredictionService.generate_event_predictions(kp_cusps, kp_system, dasha, lang='en', age=30)
    print('Predictions count:', len(result.get('predictions', [])))
    if result['predictions']:
        print('First prediction:', result['predictions'][0]['event'])
except Exception as e:
    print('KPPredictionService ERROR:', e)
    import traceback
    traceback.print_exc()
