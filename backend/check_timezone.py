"""
Check timezone handling for Lovisha's birth time
"""
from datetime import datetime
import pytz

# Birth details
year, month, day = 1997, 10, 17
hour, minute = 19, 55

# Create datetime in IST
ist = pytz.timezone('Asia/Kolkata')
birth_time_ist = ist.localize(datetime(year, month, day, hour, minute))

print("Birth Time Analysis")
print("="*60)
print(f"Input: {day}-{month}-{year} at {hour}:{minute}")
print(f"Assumed timezone: IST (Asia/Kolkata)")
print()
print(f"Local time (IST): {birth_time_ist}")
print(f"UTC time: {birth_time_ist.astimezone(pytz.UTC)}")
print(f"UTC offset: {birth_time_ist.strftime('%z')}")
print()

# Convert to UTC for Skyfield
utc_time = birth_time_ist.astimezone(pytz.UTC)
print(f"For Skyfield calculation:")
print(f"  Year: {utc_time.year}")
print(f"  Month: {utc_time.month}")
print(f"  Day: {utc_time.day}")
print(f"  Hour: {utc_time.hour}")
print(f"  Minute: {utc_time.minute}")
print()

# Now calculate with Skyfield
from services.skyfield_engine import SkyfieldService
from services.vedic_astro_engine import VedicAstroEngine

lat, lng = 31.3260, 75.5762

# Using LOCAL time (as we currently do)
print("="*60)
print("CURRENT METHOD (using local time directly):")
angles_local = SkyfieldService.calculate_angles(year, month, day, hour, minute, lat, lng)
ayanamsa = VedicAstroEngine.calculate_ayanamsa(year, month, day)
sidereal_asc_local = (angles_local['Ascendant'] - ayanamsa) % 360
signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
         "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
sign_idx_local = int(sidereal_asc_local // 30)
pos_local = sidereal_asc_local % 30
print(f"Tropical Asc: {angles_local['Ascendant']:.2f}°")
print(f"Sidereal Asc: {sidereal_asc_local:.2f}° = {signs[sign_idx_local]} {pos_local:.2f}°")
print()

# Using UTC time
print("ALTERNATIVE METHOD (using UTC time):")
angles_utc = SkyfieldService.calculate_angles(
    utc_time.year, utc_time.month, utc_time.day, 
    utc_time.hour, utc_time.minute, lat, lng
)
sidereal_asc_utc = (angles_utc['Ascendant'] - ayanamsa) % 360
sign_idx_utc = int(sidereal_asc_utc // 30)
pos_utc = sidereal_asc_utc % 30
print(f"Tropical Asc: {angles_utc['Ascendant']:.2f}°")
print(f"Sidereal Asc: {sidereal_asc_utc:.2f}° = {signs[sign_idx_utc]} {pos_utc:.2f}°")
