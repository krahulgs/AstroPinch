"""
Debug script to understand the house calculation issue
"""
from services.vedic_astro_engine import VedicAstroEngine

# Lovisha's data
year, month, day = 1997, 10, 17
hour, minute = 19, 55
lat, lng = 31.3260, 75.5762

sidereal_data = VedicAstroEngine.calculate_sidereal_planets(
    year, month, day, hour, minute, lat, lng
)

print("="*80)
print("ASCENDANT ANALYSIS")
print("="*80)
asc = sidereal_data['ascendant']
print(f"Ascendant Sign: {asc['sign']}")
print(f"Ascendant Longitude: {asc['longitude']:.4f}°")
print(f"Ascendant Position in Sign: {asc['longitude'] % 30:.2f}°")
print(f"Ascendant Sign ID: {asc['sign_id']}")
print()

print("="*80)
print("PLANETARY POSITIONS WITH HOUSE ANALYSIS")
print("="*80)
print(f"{'Planet':<12} {'Sign':<12} {'Sign Lon':<10} {'House':<6} {'Pos in Sign'}")
print("-"*80)

# Map signs to numbers for analysis
sign_map = {
    'Aries': 1, 'Taurus': 2, 'Gemini': 3, 'Cancer': 4,
    'Leo': 5, 'Virgo': 6, 'Libra': 7, 'Scorpio': 8,
    'Sagittarius': 9, 'Capricorn': 10, 'Aquarius': 11, 'Pisces': 12
}

asc_sign_num = sign_map[asc['sign']]
print(f"{'ASCENDANT':<12} {asc['sign']:<12} {asc_sign_num:<10} {'1 (def)':<6} {asc['longitude']%30:.2f}°")
print("-"*80)

for p in sidereal_data['planets']:
    planet_sign_num = sign_map[p['sign']]
    # Calculate what house SHOULD be
    # In whole sign: if planet is in same sign as Asc, it's House 1
    # If planet is in next sign, it's House 2, etc.
    expected_house = ((planet_sign_num - asc_sign_num) % 12) + 1
    
    match = "✓" if expected_house == p['house'] else f"✗ (got {p['house']})"
    
    print(f"{p['name']:<12} {p['sign']:<12} {planet_sign_num:<10} {expected_house:<6} {p['position']:.2f}° {match}")

print()
print("="*80)
print("REFERENCE CHART COMPARISON")
print("="*80)
print("According to reference chart:")
print("- Ascendant (Lagna) should be in House 2 at 09°")
print("- Moon should be in House 1 at 20°")
print("- Saturn should be in House 12 at 22°")
print()
print("Our calculation shows:")
print(f"- Ascendant in House 1 (Cancer) at {asc['longitude']%30:.2f}°")
print()
print("ISSUE IDENTIFIED:")
print("The reference chart appears to show Ascendant at 9° in House 2")
print("This suggests the reference uses a DIFFERENT ascendant sign!")
print()
print("Let me check if Ascendant should be in LEO (next sign):")
leo_asc_deg = (asc['longitude'] + 30) % 360
print(f"If Ascendant were in Leo: {leo_asc_deg:.2f}° = {leo_asc_deg%30:.2f}° in Leo")
print("That would be ~9° in Leo, matching the reference!")
