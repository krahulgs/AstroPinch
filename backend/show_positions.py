from services.vedic_astro_engine import VedicAstroEngine

d = VedicAstroEngine.calculate_sidereal_planets(1997, 10, 17, 19, 55, 31.3260, 75.5762)

print(f"Ascendant: {d['ascendant']['sign']} at {d['ascendant']['longitude']%30:.2f} degrees")
print(f"Ascendant House: 1 (by definition)")
print()
print("Planetary Positions:")
print("-" * 70)
print(f"{'Planet':<12} {'House':<7} {'Sign':<13} {'Degrees':<10} {'Retro'}")
print("-" * 70)

for p in d['planets']:
    retro = "Yes" if p.get('retrograde') else "No"
    print(f"{p['name']:<12} {p['house']:<7} {p['sign']:<13} {p['position']:>6.2f}°    {retro}")
