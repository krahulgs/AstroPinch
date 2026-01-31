"""
Test ascendant calculation for Lovisha
"""
from services.skyfield_engine import SkyfieldService
from services.vedic_astro_engine import VedicAstroEngine

year, month, day = 1997, 10, 17
hour, minute = 19, 55
lat, lng = 31.3260, 75.5762

print("Testing Ascendant Calculation")
print("="*60)

# Get tropical ascendant
angles = SkyfieldService.calculate_angles(year, month, day, hour, minute, lat, lng)
tropical_asc = angles['Ascendant']

print(f"Tropical Ascendant: {tropical_asc:.4f}°")

# Get ayanamsa
ayanamsa = VedicAstroEngine.calculate_ayanamsa(year, month, day)
print(f"Ayanamsa (Lahiri): {ayanamsa:.4f}°")

# Calculate sidereal
sidereal_asc = (tropical_asc - ayanamsa) % 360
print(f"Sidereal Ascendant: {sidereal_asc:.4f}°")

# Determine sign
signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
         "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
sign_idx = int(sidereal_asc // 30) % 12
pos_in_sign = sidereal_asc % 30

print(f"\nSidereal Ascendant Sign: {signs[sign_idx]}")
print(f"Position in Sign: {pos_in_sign:.2f}°")

print("\n" + "="*60)
print("REFERENCE CHART SHOWS:")
print("Ascendant at 9.55° in House 2 (which would be Leo if House 1 is Cancer)")
print("\nOUR CALCULATION:")
print(f"Ascendant at {pos_in_sign:.2f}° in {signs[sign_idx]}")

if signs[sign_idx] == "Cancer" and pos_in_sign > 20:
    print("\n⚠️  ISSUE FOUND:")
    print("Our Asc is at 24° Cancer, but reference shows 9° in next sign (Leo)")
    print("This suggests the reference chart is using a DIFFERENT calculation!")
    print("\nPossible causes:")
    print("1. Different Ayanamsa (KP, Raman, etc. instead of Lahiri)")
    print("2. Different time zone interpretation")
    print("3. Different birth time (maybe 19:55 is not IST?)")
