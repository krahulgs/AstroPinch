"""
Simple test to generate and save Lovisha's chart
"""
import sys
sys.path.append('.')

from services.vedic_astro_engine import VedicAstroEngine
from services.chart_generator import ChartGenerator

# Birth details for Lovisha Gumber
year, month, day = 1997, 10, 17
hour, minute = 19, 55
lat, lng = 31.3260, 75.5762

print("Calculating sidereal positions...")
sidereal_data = VedicAstroEngine.calculate_sidereal_planets(
    year, month, day, hour, minute, lat, lng
)

print(f"\nAyanamsa: {sidereal_data['ayanamsa']}°")
print(f"Ascendant: {sidereal_data['ascendant']['sign']} at {sidereal_data['ascendant']['longitude']:.2f}°")
print(f"\nPlanets ({len(sidereal_data['planets'])} total):")
print("-" * 80)
print(f"{'Planet':<12} {'Sign':<12} {'House':<6} {'Deg in Sign':<12} {'Retrograde'}")
print("-" * 80)

for p in sidereal_data['planets']:
    retro = " (R)" if p.get('retrograde') else ""
    print(f"{p['name']:<12} {p['sign']:<12} {p['house']:<6} {p['position']:>6.2f}°      {retro}")

print("\n" + "=" * 80)
print("Generating North Indian chart...")
print("=" * 80)

try:
    img_buffer = ChartGenerator.generate_lagna_chart_north_indian(sidereal_data)
    with open('lovisha_north_chart.png', 'wb') as f:
        f.write(img_buffer.read())
    print("✓ North Indian chart saved as: lovisha_north_chart.png")
except Exception as e:
    print(f"✗ Error generating North chart: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 80)
print("Generating South Indian chart...")
print("=" * 80)

try:
    img_buffer = ChartGenerator.generate_lagna_chart_south_indian(sidereal_data)
    with open('lovisha_south_chart.png', 'wb') as f:
        f.write(img_buffer.read())
    print("✓ South Indian chart saved as: lovisha_south_chart.png")
except Exception as e:
    print(f"✗ Error generating South chart: {e}")
    import traceback
    traceback.print_exc()

print("\nDone!")
