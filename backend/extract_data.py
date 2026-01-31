import json
from services.vedic_astro_engine import VedicAstroEngine

# Lovisha's birth details
year, month, day = 1997, 10, 17
hour, minute = 19, 55
lat, lng = 31.3260, 75.5762

sidereal_data = VedicAstroEngine.calculate_sidereal_planets(
    year, month, day, hour, minute, lat, lng
)

# Save to JSON for inspection
with open('lovisha_data.json', 'w') as f:
    json.dump(sidereal_data, f, indent=2)

print("Data saved to lovisha_data.json")
print(f"\nFound {len(sidereal_data['planets'])} planets")
for p in sidereal_data['planets']:
    print(f"  - {p['name']}: House {p['house']}, {p['sign']} {p['position']:.2f}°")
