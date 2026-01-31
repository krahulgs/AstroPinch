"""
Find which ayanamsa gives Leo Ascendant at ~9° for Lovisha
"""
from services.skyfield_engine import SkyfieldService

year, month, day = 1997, 10, 17
hour, minute = 19, 55
lat, lng = 31.3260, 75.5762

# Get tropical ascendant
angles = SkyfieldService.calculate_angles(year, month, day, hour, minute, lat, lng)
tropical_asc = angles['Ascendant']

print(f"Tropical Ascendant: {tropical_asc:.4f}°")
print()

# Target: Leo at 9.55° = 120° + 9.55° = 129.55° sidereal
target_sidereal = 120 + 9.55  # Leo starts at 120°

# Calculate what ayanamsa would give us this
required_ayanamsa = (tropical_asc - target_sidereal) % 360
if required_ayanamsa > 180:
    required_ayanamsa = required_ayanamsa - 360

print(f"Target Sidereal Ascendant: {target_sidereal:.2f}° (Leo 9.55°)")
print(f"Required Ayanamsa: {required_ayanamsa:.4f}°")
print()

# Common ayanamsas for 1997
print("Common Ayanamsas for 1997:")
print(f"  Lahiri (default): ~23.90°")
print(f"  KP (Krishnamurti): ~23.84°")
print(f"  Raman: ~22.37°")
print(f"  Required for Leo 9.55°: {required_ayanamsa:.2f}°")
print()

# Test with different ayanamsas
ayanamsas = {
    "Lahiri": 23.9024,
    "KP": 23.84,
    "Raman": 22.37,
    "Required": required_ayanamsa
}

print("Results with different Ayanamsas:")
print("-" * 60)
signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
         "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]

for name, ayanamsa in ayanamsas.items():
    sidereal_asc = (tropical_asc - ayanamsa) % 360
    sign_idx = int(sidereal_asc // 30)
    pos_in_sign = sidereal_asc % 30
    print(f"{name:12} ({ayanamsa:6.2f}°): {signs[sign_idx]:12} at {pos_in_sign:5.2f}°")
