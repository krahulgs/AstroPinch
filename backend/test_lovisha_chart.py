"""
Test script to verify chart calculations for Lovisha Gumber
Birth Details: 17-10-1997, 19:55, Jalandhar, Punjab, India
"""

from services.vedic_astro_engine import VedicAstroEngine
from services.chart_generator import ChartGenerator
import json

# Birth details
name = "Lovisha Gumber"
year = 1997
month = 10
day = 17
hour = 19
minute = 55

# Jalandhar coordinates
lat = 31.3260
lng = 75.5762

print(f"Calculating chart for {name}")
print(f"Birth: {day}-{month}-{year} at {hour}:{minute}")
print(f"Location: Jalandhar ({lat}, {lng})")
print("="*60)

# Get sidereal data
sidereal_data = VedicAstroEngine.calculate_sidereal_planets(
    year, month, day, hour, minute, lat, lng
)

print(f"\nAyanamsa: {sidereal_data['ayanamsa']}°")
print(f"Ascendant: {sidereal_data['ascendant']['sign']} ({sidereal_data['ascendant']['longitude']:.2f}°)")
print("\nPlanetary Positions:")
print("-"*60)
print(f"{'Planet':<12} {'Sign':<12} {'House':<6} {'Position':<10} {'Nakshatra':<15}")
print("-"*60)

for planet in sidereal_data['planets']:
    print(f"{planet['name']:<12} {planet['sign']:<12} {planet['house']:<6} "
          f"{planet['position']:.2f}° {planet['nakshatra']['name']:<15}")

# Expected positions from reference chart:
print("\n" + "="*60)
print("REFERENCE CHART POSITIONS:")
print("="*60)
reference = {
    "Lagna": "House 2 (Taurus area based on position)",
    "Moon": "House 1 (20° - shown at top)",
    "Saturn": "House 12 (22°)",
    "Rahu": "House 5 (23° - Retrograde)",
    "Ketu": "House 11 (23°)",
    "Mars": "House 8 (19°)",
    "Venus": "House 8 (16° - Vargottama)",
    "Pluto": "House 8 (10°)",
    "Mercury": "House 7 (03° - Combust, Vargottama)",
    "Sun": "House 7 (00° - Vargottama, Debilitated)",
    "Neptune": "House 10 (03°)",
    "Jupiter": "House 10 (18°)",
    "Uranus": "House 9 (11°)"
}

for planet, position in reference.items():
    print(f"{planet:<12} {position}")

# Calculate divisional charts
divisional = VedicAstroEngine.calculate_divisional_charts(sidereal_data)
print("\n" + "="*60)
print("NAVAMSA (D9) POSITIONS:")
print("="*60)
for planet in divisional['D9']:
    print(f"{planet['name']:<12} {planet['sign']:<12} House {planet['house']}")
