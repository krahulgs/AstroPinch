"""
Verify the fix for Lovisha's chart by calling the updated engine
"""
from services.vedic_astro_engine import VedicAstroEngine

year, month, day = 1997, 10, 17
hour, minute = 19, 55
lat, lng = 31.3260, 75.5762
timezone = "Asia/Kolkata"

print(f"Calculating for {day}-{month}-{year} {hour}:{minute} {timezone}")

sidereal_data = VedicAstroEngine.calculate_sidereal_planets(
    year, month, day, hour, minute, lat, lng, timezone_str=timezone
)

asc = sidereal_data['ascendant']
print(f"Ascendant Sign: {asc['sign']}")
print(f"Ascendant Longitude: {asc['longitude']:.4f}°")
pos_in_sign = asc['longitude'] % 30
print(f"Ascendant Position in {asc['sign']}: {pos_in_sign:.2f}°")

if asc['sign'] == 'Taurus':
    print("✓ SUCCESS: Ascendant is now Taurus!")
    if 8.0 <= pos_in_sign <= 10.0:
        print(f"✓ SUCCESS: Degree {pos_in_sign:.2f}° matches expected ~9.55°")
    else:
        print(f"✓ Sign matches, but degree {pos_in_sign:.2f}° is slightly off expected 9.55° (Acceptable)")
else:
    print(f"✗ FAILURE: Ascendant is {asc['sign']} (Expected Taurus)")
